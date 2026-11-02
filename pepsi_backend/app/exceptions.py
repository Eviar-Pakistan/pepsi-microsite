import logging

from django.conf import settings
from rest_framework.exceptions import APIException, ParseError, Throttled, ValidationError
from rest_framework.response import Response

logger = logging.getLogger("app")


class AppError(APIException):
    def __init__(self, status_code, message, code=None):
        self.status_code = status_code
        self.app_code = code
        super().__init__(detail=message, code=code or "error")


def api_exception_handler(exc, context):
    if isinstance(exc, AppError):
        body = {"status": "failed", "message": str(exc.detail)}
        if exc.app_code:
            body["code"] = exc.app_code
        return Response(body, status=exc.status_code)

    if isinstance(exc, Throttled):
        return Response(
            {
                "status": "failed",
                "message": "Too many requests. Please wait and try again.",
                "code": "RATE_LIMIT",
            },
            status=429,
        )

    if isinstance(exc, (ParseError, ValidationError)):
        return Response(
            {
                "status": "failed",
                "message": "Check your details and try again.",
                "code": "VALIDATION",
            },
            status=400,
        )

    logger.exception("unhandled error")
    if settings.DEBUG:
        return None

    return Response(
        {
            "status": "failed",
            "message": "Something went wrong on our side. Please try again later.",
        },
        status=500,
    )