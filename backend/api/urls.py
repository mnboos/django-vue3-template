from django.urls import path, include
from rest_framework import routers
from rest_framework.routers import Route

from . import views

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet, basename="User")
# router.register(r'groups', views.GroupViewSet)
# router.register(r"pipelines", views.PipelinesView, basename="Pipeline")
# router.register(r"modules", views.ModulesView, basename="Modules")
# router.register(r"pipelinemodules", views.PipelineModulesView, basename="PipelineModules")
router.register(r"auth", views.AuthenticationView, basename="Auth")


urlpatterns = [
    path("", include(router.urls)),
    # path('', views.index, name='index'),
    # path('auth/', views.AuthenticationView),
    path("csrf/", views.csrf, name="auth"),
    # path('auth/login/', views.login, name='auth'),
    # path('auth/logout/', views.logout, name='auth'),
    # path("pipelines/", views.PipelinesView.as_view()),
]
