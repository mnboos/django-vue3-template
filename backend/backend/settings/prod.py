import os
from loguru import logger

# noinspection PyUnresolvedReferences
from .dev import *

DEBUG = os.environ.get("DEBUG", "False") == "True"
logger.info("DEBUG = {}", DEBUG)
DEBUG_PROPAGATE_EXCEPTIONS = DEBUG
if DEBUG:
    logger.warning("DEBUG enabled!")

assert os.environ.get("DJANGO_SECRET_KEY"), "Environment variable 'DJANGO_SECRET_KEY' not set"
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

assert os.environ.get(
    "CORS_ALLOWED_ORIGINS"
), "Environment variable 'CORS_ALLOWED_ORIGINS' not set. Set it to a comma delimited string"
CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")

logger.info(f"CORS_ALLOWED_ORIGINS: {','.join(CORS_ALLOWED_ORIGINS)}")

SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"
