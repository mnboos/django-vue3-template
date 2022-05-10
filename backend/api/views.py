from django.contrib import auth
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import render

# Create your views here.
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, viewsets, status, mixins
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.request import Request
from rest_framework.response import Response


# @permission_classes((permissions.IsAdminUser, IsOwner,))
# @permission_classes((permissions.IsAuthenticated))
from api.models import User
from api.serializers import UserSerializer


@permission_classes((permissions.IsAuthenticated,))
class DummyViewSet(
    viewsets.GenericViewSet,
):
    @action(detail=False, methods=["post"])
    def undetailed_post(self, request: Request):
        return Response(status=status.HTTP_204_NO_CONTENT)


@permission_classes((permissions.IsAuthenticated,))
class UserViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    # renderer_classes = (JSONRenderer,)

    # authentication_classes = (authentication.TokenAuthentication,)
    # permission_classes = (permissions.IsAuthenticated,)

    serializer_class = UserSerializer
    queryset = User.objects


# @api_view(["get"])
# def csrf(request):
#     get_token(request)
#     return Response()


@permission_classes((permissions.AllowAny,))
class AuthenticationView(viewsets.ViewSet):
    @csrf_exempt
    @action(methods=["post"], url_path="login", detail=False)
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = auth.authenticate(request, username=username, password=password)
        if not user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        else:
            first_login = not user.last_login
            auth.login(request, user)
            username = user.username
            return Response(
                {
                    "user": {"username": username},
                    "firstLogin": first_login,
                }
            )

    @action(methods=["post"], url_path="logout", detail=False)
    def logout(self, request):
        if request.user.is_authenticated:
            auth.logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
