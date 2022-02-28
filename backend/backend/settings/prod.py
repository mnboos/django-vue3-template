import os

from .dev import *

DEBUG = False

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = True

CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = True


# A PostgreSQL db could be specified via service:
# https://docs.djangoproject.com/en/4.0/ref/databases/#postgresql-connection-settings
DATABASES = {
    "default": {
        "NAME": "postgres",
        "ENGINE": "django.db.backends.postgresql",
        "USER": os.environ.get("DB_USER", "postgres"),
        "PASSWORD": os.environ.get("DB_PASSWORD", "admin"),
        "HOST": os.environ.get("DB_HOST", "localhost"),
        "PORT": os.environ.get("DB_PORT", "5432"),
    }
}