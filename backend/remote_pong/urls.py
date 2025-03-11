from django.urls import path
from .views import match_maker

urlpatterns = [
	path("matchmaking/", match_maker, name="matchmaking")
]
