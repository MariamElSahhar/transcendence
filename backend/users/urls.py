from django.urls import path
from .views import (
    user_list_create_view,
    user_retrieve_update_destroy_view,
    register_view,
    login_view,
    token_refresh_view,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # User Management
    path("users/", user_list_create_view, name="user-list-create"),
    path(
        "users/<int:user_id>/",
        user_retrieve_update_destroy_view,
        name="user-retrieve-update-destroy",
    ),
    # Authentication
    path("register/", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("token/refresh/", token_refresh_view, name="token_refresh"),

    # just for testing
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
