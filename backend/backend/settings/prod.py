from loguru import logger

# noinspection PyUnresolvedReferences
from .dev import *

DEBUG = os.environ.get("DEBUG", "False") == "True"
logger.info("DEBUG = {}", DEBUG)
DEBUG_PROPAGATE_EXCEPTIONS = DEBUG
if DEBUG:
    logger.warning("DEBUG enabled!")

SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"
