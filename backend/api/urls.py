from django.urls import path, include
from rest_framework import routers
from rest_framework.routers import Route

from . import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet, basename="User")
router.register(r"auth", views.AuthenticationView, basename="Auth")
router.register(r"dummy", views.DummyViewSet, basename="Dummy")


urlpatterns = [
    path("", include(router.urls)),
]
