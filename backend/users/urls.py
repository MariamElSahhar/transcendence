from django.urls import path
from .views import (
    user_list_create_view,
    user_retrieve_update_destroy_view,
    register_view,
    login_view,
    token_refresh_view,
	token_status_view,
    verify_otp_view
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView)

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

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
    path("verify-otp/", verify_otp_view, name="verify-otp"),
    path("token/status/", token_status_view, name="token_status"),

    # API Schema and AutoDocs
    path('schema/', SpectacularAPIView.as_view(), name='api-schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='api-schema'),
         name='api-docs'),
]
