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

SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"
