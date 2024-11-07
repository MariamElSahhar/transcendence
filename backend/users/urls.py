from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

from .user_views import (
    login_view,
    logout_view,
    register_view,
    verify_otp_view,
)
from .views import (
    token_refresh_view,
    token_status_view,
    user_list_create_view,
    user_retrieve_update_destroy_view,
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
    path("logout/", logout_view, name="logout"),
    path("token/refresh/", token_refresh_view, name="token_refresh"),
    path("token/status/", token_status_view, name="token_status"),
    path("verify-otp/", verify_otp_view, name="verify-otp"),
    # API Schema and AutoDocs
    path("schema/", SpectacularAPIView.as_view(), name="api-schema"),
    path(
        "docs/", SpectacularSwaggerView.as_view(url_name="api-schema"), name="api-docs"
    ),
]
