from django.contrib import auth
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response


@api_view(["get"])
def csrf(request):
    get_token(request)
    return Response()


@permission_classes((permissions.AllowAny,))
class AuthenticationView(viewsets.ViewSet):
    @csrf_exempt
    @action(methods=["post"], url_path="login", detail=False)
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = auth.authenticate(request, username=username, password=password)
        success = False
        first_login = None
        username = None
        if user is not None:
            first_login = not user.last_login
            auth.login(request, user)
            username = user.username
            success = True
        return JsonResponse(
            {
                "success": success,
                "user": {"username": username},
                "firstLogin": first_login,
            }
        )

    @action(methods=["post"], url_path="logout", detail=False)
    def logout(self, request):
        if request.user.is_authenticated:
            auth.logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=["get"], url_path="user", detail=False)
    def user(self, request):
        # logger.critical("hello world")
        return JsonResponse(
            {
                "isAuthenticated": request.user.is_authenticated,
                "user": {"username": request.user.username},
            }
        )
