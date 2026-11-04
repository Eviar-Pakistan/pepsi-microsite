import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
# override=True so edited .env values win over stale process env
load_dotenv(BASE_DIR / ".env", override=True)


def env_bool(name, default=False):
    raw = os.environ.get(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def env_list(name):
    return [x.strip() for x in os.environ.get(name, "").split(",") if x.strip()]


def env_int(name, default):
    raw = os.environ.get(name)
    if raw is None or not str(raw).strip():
        return default
    try:
        return int(str(raw).strip())
    except ValueError:
        return default


SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "").strip()
if not SECRET_KEY:
    raise RuntimeError("Set DJANGO_SECRET_KEY")

DEBUG = env_bool("DJANGO_DEBUG", False)
ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS") or ["localhost", "127.0.0.1"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "app",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "pepsi_backend.urls"
WSGI_APPLICATION = "pepsi_backend.wsgi.application"
APPEND_SLASH = False

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {
        "context_processors": [
            "django.template.context_processors.request",
            "django.contrib.auth.context_processors.auth",
            "django.contrib.messages.context_processors.messages",
        ],
    },
}]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.environ.get("DATABASE_NAME", "").strip(),
        "USER": os.environ.get("DATABASE_USER", "").strip(),
        "PASSWORD": os.environ.get("DATABASE_PASSWORD", "").strip(),
        "HOST": os.environ.get("DATABASE_HOST", "").strip(),
        "PORT": os.environ.get("DATABASE_PORT", "3306").strip(),
        "OPTIONS": {"charset": "utf8mb4"},
    }
}

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Karachi"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

DATA_UPLOAD_MAX_MEMORY_SIZE = 1_048_576

CORS_ALLOWED_ORIGINS = env_list("CORS_ORIGIN")
CORS_ALLOW_CREDENTIALS = False
CORS_ALLOW_METHODS = ["GET", "POST", "OPTIONS"]

TRUEFAN_BASE_URL = os.environ.get("TRUEFAN_BASE_URL", "https://newvideorequest.truefans.in").rstrip("/")
TRUEFAN_API_KEY = os.environ.get("TRUEFAN_API_KEY", "").strip()
TRUEFAN_VENDOR_ID = os.environ.get("TRUEFAN_VENDOR_ID", "85").strip()
TRUEFAN_TEMPLATE_ID = os.environ.get("TRUEFAN_TEMPLATE_ID", "").strip()
TRUEFAN_VIDEO_HOSTS = [h.lower() for h in env_list("TRUEFAN_VIDEO_HOSTS")]
TRUEFAN_TIMEOUT = (5, 10)
MAX_VIDEO_BYTES = 100 * 1024 * 1024
# Max form submissions allowed per phone number (User rows). Change via env.
MAX_ENTRIES_PER_PHONE = env_int("MAX_ENTRIES_PER_PHONE", 3)

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "pepsi",
    }
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES": ["rest_framework.parsers.JSONParser"],
    "EXCEPTION_HANDLER": "app.exceptions.api_exception_handler",
    "DEFAULT_THROTTLE_RATES": {
        "create_video": "5/min",
        "video_status": "30/min",
        "video_download": "10/min",
    },
    "UNAUTHENTICATED_USER": None,
}

SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"

if not DEBUG:
    SECURE_SSL_REDIRECT = env_bool("DJANGO_SSL_REDIRECT", True)
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")