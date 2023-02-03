from django.contrib import auth
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, mixins, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response

from .models import User
from .serializers import (

    UserSerializer, GroupSerializer,
)
from loguru import logger

# Create your views here.
from api.utils import require_param


@permission_classes((permissions.IsAuthenticated,))
class UserViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    # renderer_classes = (JSONRenderer,)

    # authentication_classes = (authentication.TokenAuthentication,)
    # permission_classes = (permissions.IsAuthenticated,)

    serializer_class = UserSerializer
    queryset = User.objects.all()

    @action(methods=["get"], detail=False, permission_classes=[permissions.IsAdminUser])
    def admins(self, request: Request):
        return Response({"youdidit": True})

    @action(methods=["get"], detail=False)
    def current(self, request):
        return Response(
            {
                "username": request.user.username,
            }
        )

#
# @permission_classes((permissions.IsAuthenticated,))
# class GroupViewSet(    mixins.ListModelMixin,
#     mixins.RetrieveModelMixin,
#     viewsets.GenericViewSet,):
#
#     serializer_class = GroupSerializer
#     queryset = Group.ob


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
