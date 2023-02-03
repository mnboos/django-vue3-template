import functools

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response


def require_param(name: str, data_type: type):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            assert len(args) >= 2, "At least two arguments are expected: view and request"
            request: Request = args[1]
            is_http_get = request.method == "GET"
            if is_http_get:
                data = request.query_params
            else:
                data = request.data
            if name not in data:
                error = "Parameter is required"
                detail = {"expected_location": "query params" if is_http_get else "body"}
            else:
                value = data[name]
                if not isinstance(value, data_type):
                    error = "Parameter has wrong type"
                    detail = {
                        "expected": data_type.__name__,
                        "actual": type(value).__name__,
                    }
                else:
                    if not value:
                        error = "Invalid value"
                        detail = {"msg": "A value is expected but it is empty, undefined or zero"}
                    else:
                        error = None
                        detail = None

            if error:
                return Response(
                    {"error": error, "parameter": name, "detail": detail}, status=status.HTTP_400_BAD_REQUEST
                )
            return func(*args, **kwargs)

        return wrapper

    return decorator
