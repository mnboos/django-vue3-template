from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r"auth", views.AuthenticationView, basename="PipelineModules")
router.register(r"users", views.UserViewSet, basename="User")

urlpatterns = [
    path("", include(router.urls)),
]
