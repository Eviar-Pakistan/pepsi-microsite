import re
import uuid

from django.conf import settings
from django.db import transaction
from django.http import StreamingHttpResponse
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .models import User, VideoJob
from .serializers import CreateVideoSerializer
from .exceptions import AppError
from .truefan import create_video, poll_status, stream_video


ORDER_RE = re.compile(
    r"^pepsi-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
)
TERMINAL = {"success", "rejected", "failed"}


class CreateThrottle(AnonRateThrottle):
    scope = "create_video"


class StatusThrottle(AnonRateThrottle):
    scope = "video_status"


class DownloadThrottle(AnonRateThrottle):
    scope = "video_download"


def rejection_message(reason):
    return {
        "TEXT_PROFANITY": "That name can’t be used. Try a different one.",
        "IMAGE_PROFANITY": "That image can’t be used. Try another.",
        "VALIDATION_FAILED": "We couldn’t process that. Please try again.",
    }.get(reason, "We couldn’t finish your video. Please try again.")


def public_job(job):
    data = {
        "orderId": job.order_id,
        "status": job.status,
        "videoUrl": job.video_url or None,
        "message": None,
    }
    if job.status == "rejected":
        data["message"] = rejection_message(job.rejection_reason)
        data["rejectionReason"] = job.rejection_reason
    elif job.status == "failed":
        data["message"] = "We couldn’t start your video. Check your details and try again."
    elif job.status == "timeout":
        data["message"] = "This is taking longer than expected. Please try again later."
    return data


def first_error(errors):
    try:
        if isinstance(errors, dict):
            for v in errors.values():
                return first_error(v)
        if isinstance(errors, (list, tuple)) and errors:
            return first_error(errors[0])
        return str(errors)
    except Exception:
        return "Check your details and try again."


def get_job(order_id):
    if not ORDER_RE.fullmatch(order_id or ""):
        raise AppError(404, "Video job not found.", "NOT_FOUND")
    job = VideoJob.objects.filter(order_id=order_id).first()
    if not job:
        raise AppError(404, "Video job not found.", "NOT_FOUND")
    return job


class HealthView(APIView):
    authentication_classes = []
    throttle_classes = []

    def get(self, request):
        return Response({"status": "ok"})


class CreateVideoView(APIView):
    authentication_classes = []
    throttle_classes = [CreateThrottle]

    def post(self, request):
        ser = CreateVideoSerializer(data=request.data)
        if not ser.is_valid():
            try:
                msg = first_error(ser.errors)
            except Exception:
                msg = "Check your details and try again."
            raise AppError(400, msg, "VALIDATION")

        data = ser.validated_data
        phone = data["phone"]
        limit = settings.MAX_ENTRIES_PER_PHONE
        if limit >= 0 and User.objects.filter(phone=phone).count() >= limit:
            raise AppError(
                429,
                "You have exceeded the number of entries allowed for this phone number.",
                "PHONE_ENTRY_LIMIT",
            )

        order_id = f"pepsi-{uuid.uuid4()}"
        name = data["name"]

        # Call TrueFan first. If this fails, nothing is saved.
        payload = create_video(order_id, name)

        video_id = (
            (payload.get("data") or {}).get("video_id")
            if isinstance(payload.get("data"), dict)
            else None
        ) or payload.get("video_id") or payload.get("VideoId") or ""

        with transaction.atomic():
            user = User.objects.create(
                name=name,
                email=data["email"],
                phone=data["phone"],
                pack_code=data.get("packCode") or "",
                privacy_consent=True,
                marketing_opt_in=bool(data.get("marketingOptIn")),
                age_confirmed=True,
                consent_at=timezone.now(),
            )
            job = VideoJob.objects.create(
                user=user,
                order_id=order_id,
                template_id=settings.TRUEFAN_TEMPLATE_ID,
                vendor_id=settings.TRUEFAN_VENDOR_ID,
                video_id=str(video_id)[:64],
                status="processing",
            )

        return Response(
            {
                "status": "success",
                "orderId": job.order_id,
                "jobStatus": job.status,
            },
            status=201,
        )


class VideoStatusView(APIView):
    authentication_classes = []
    throttle_classes = [StatusThrottle]

    def get(self, request, order_id):
        job = get_job(order_id)
        if job.status in TERMINAL:
            return Response({"status": "success", "data": public_job(job)})

        try:
            payload = poll_status(order_id)
        except AppError as exc:
            if exc.app_code == "UPSTREAM_AUTH":
                raise
            return Response({"status": "success", "data": public_job(job)})

        data = payload.get("data") if isinstance(payload.get("data"), dict) else payload
        if not isinstance(data, dict):
            data = {}
        status = str(data.get("status") or payload.get("status") or "").lower()
        video_url = str(data.get("video_url") or payload.get("video_url") or "")[:2048]
        video_id = data.get("video_id") or payload.get("video_id")
        reason = str(data.get("rejection_reason") or "")[:64]

        if status == "success" and video_url:
            host = urlparse_host(video_url)
            if host in settings.TRUEFAN_VIDEO_HOSTS and video_url.startswith("https://"):
                job.status = "success"
                job.video_url = video_url
                if video_id is not None:
                    job.video_id = str(video_id)[:64]
                job.rejection_reason = ""
                job.save(update_fields=["status", "video_url", "video_id", "rejection_reason", "updated_at"])
        elif status == "rejected":
            job.status = "rejected"
            job.rejection_reason = reason
            job.save(update_fields=["status", "rejection_reason", "updated_at"])
        elif status in {"validating", "processing"}:
            job.status = status
            if video_id is not None:
                job.video_id = str(video_id)[:64]
            job.save(update_fields=["status", "video_id", "updated_at"])
        elif status:
            job.status = "processing"
            job.save(update_fields=["status", "updated_at"])

        return Response({"status": "success", "data": public_job(job)})


def urlparse_host(url):
    from urllib.parse import urlparse
    return (urlparse(url).hostname or "").lower()


class DownloadVideoView(APIView):
    authentication_classes = []
    throttle_classes = [DownloadThrottle]

    def get(self, request, order_id):
        job = get_job(order_id)
        if job.status != "success" or not job.video_url:
            raise AppError(409, "Video is not ready for download yet.", "NOT_READY")

        upstream = stream_video(job.video_url)

        def chunks():
            sent = 0
            try:
                for chunk in upstream.iter_content(64 * 1024):
                    if not chunk:
                        continue
                    sent += len(chunk)
                    if sent > settings.MAX_VIDEO_BYTES:
                        break
                    yield chunk
            finally:
                upstream.close()

        resp = StreamingHttpResponse(chunks(), content_type="video/mp4")
        resp["Content-Disposition"] = f'attachment; filename="pepsi-video-{order_id}.mp4"'
        resp["X-Content-Type-Options"] = "nosniff"
        return resp


