from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

from .views.users_views import (
    user_list_create_view,
    user_retrieve_update_destroy_view,
	check_username_exists,
	check_email_exists,
)
from .views.token_views import (
    token_refresh_view,
    token_status_view,
)
from .views.auth_views import (
    login_view,
    logout_view,
    register_view,
    verify_otp_view,
)
from .views.friends_views import (
    get_add_friends_view,
    remove_friend_view,
)

urlpatterns = [
    # User Management
    path("users/", user_list_create_view, name="user-list-create"),
    path(
        "users/<int:user_id>/",
        user_retrieve_update_destroy_view,
        name="user-retrieve-update-destroy",
    ),

    # Existing username/email
    path("users/username/<str:username>/exists/", check_username_exists, name="username-exists"),
	path("users/email/<str:email>/exists/", check_email_exists, name="email-exists"),

    # Authentication
	path("register/", register_view, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("verify-otp/", verify_otp_view, name="verify-otp"),
    path("token/refresh/", token_refresh_view, name="token_refresh"),
    path("token/status/", token_status_view, name="token_status"),

    # Friends
    path("friends/", get_add_friends_view, name="add-get-friends"),
    path("friends/<int:friend_id>/", remove_friend_view, name="remove-friend"),

    # API Schema and AutoDocs
    path("schema/", SpectacularAPIView.as_view(), name="api-schema"),
    path(
        "docs/", SpectacularSwaggerView.as_view(url_name="api-schema"), name="api-docs"
    ),
]
