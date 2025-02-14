from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

from .views import (test_view, match_maker)

urlpatterns = [
    # User Management
    path("", test_view, name="test-view"),
	path("matchmaking/", match_maker, name="matchmaking")
]
