import logging
import time
from urllib.parse import urlparse
import requests
from django.conf import settings
from .exceptions import AppError


logger = logging.getLogger("app")


def _headers():
    return {
        "x-api-key": settings.TRUEFAN_API_KEY,
        "Content-Type": "application/json",
    }

def _ensure_configured():
    if not settings.TRUEFAN_API_KEY or not settings.TRUEFAN_TEMPLATE_ID:
        raise AppError(503, "Something went wrong on our side. Please try again later.", "NOT_CONFIGURED")


def _map_http(status):
    if status == 401:
        return AppError(502, "Something went wrong on our side. Please try again later.", "UPSTREAM_AUTH")
    if status == 409:
        return AppError(409, "This request was already submitted.", "DUPLICATE_ORDER_ID")
    if status >= 500:
        return AppError(502, "Servers are busy. Please try again in a few minutes.", "UPSTREAM_5XX")
    return AppError(400, "We couldn’t start your video. Check your details and try again.", "UPSTREAM_4XX")


def truefan_post(path, body):
    _ensure_configured()
    try:
        r = requests.post(
            f"{settings.TRUEFAN_BASE_URL}{path}",
            json=body,
            headers=_headers(),
            timeout=settings.TRUEFAN_TIMEOUT,
        )
    except requests.RequestException as exc:
        raise AppError(502, "Servers are busy. Please try again in a few minutes.", "UPSTREAM_5XX") from exc

    if not r.ok:
        # Log status only — never return upstream auth bodies to clients
        logger.info(
            "truefan http=%s path=%s vendor=%s",
            r.status_code,
            path,
            settings.TRUEFAN_VENDOR_ID,
        )
        raise _map_http(r.status_code)

    try:
        return r.json()
    except ValueError:
        return {}


def create_video(order_id, person_name):
    body = {
        "vendor_id": int(settings.TRUEFAN_VENDOR_ID),
        "template_id": settings.TRUEFAN_TEMPLATE_ID,
        "order_id": order_id,
        "data": {"person_name": person_name},
    }
    delay = 1
    for attempt in range(4):
        try:
            return truefan_post("/api/v2/post_new_request", body)
        except AppError as exc:
            if exc.app_code != "UPSTREAM_5XX" or attempt == 3:
                raise
            time.sleep(delay)
            delay *= 2


def poll_status(order_id):
    return truefan_post(
        "/api/video-status",
        {"vendor_id": int(settings.TRUEFAN_VENDOR_ID), "order_id": order_id},
    )


def assert_safe_video_url(url):
    parsed = urlparse(url or "")
    host = (parsed.hostname or "").lower()
    if parsed.scheme != "https" or not host or parsed.username or parsed.password:
        raise AppError(502, "Could not fetch video file. Try opening it in a new tab.", "DOWNLOAD_FAILED")
    if host not in settings.TRUEFAN_VIDEO_HOSTS:
        raise AppError(502, "Could not fetch video file. Try opening it in a new tab.", "DOWNLOAD_FAILED")


def stream_video(url):
    assert_safe_video_url(url)
    try:
        r = requests.get(url, stream=True, timeout=(5, 20), allow_redirects=False)
    except requests.RequestException as exc:
        raise AppError(502, "Could not fetch video file. Try opening it in a new tab.", "DOWNLOAD_FAILED") from exc

    if r.status_code != 200:
        r.close()
        raise AppError(502, "Could not fetch video file. Try opening it in a new tab.", "DOWNLOAD_FAILED")

    length = r.headers.get("Content-Length")
    if length and length.isdigit() and int(length) > settings.MAX_VIDEO_BYTES:
        r.close()
        raise AppError(502, "Could not fetch video file. Try opening it in a new tab.", "DOWNLOAD_FAILED")

    ctype = (r.headers.get("Content-Type") or "").split(";")[0].strip().lower()
    if ctype not in {"video/mp4", "application/octet-stream"}:
        r.close()
        raise AppError(502, "Could not fetch video file. Try opening it in a new tab.", "DOWNLOAD_FAILED")

    return r