from django.urls import path
from .views.play_views import (
    make_move_view,
    play_view,
    join_matchmaking_view,
    cancel_matchmaking_view,
    finished_game_view,
)

urlpatterns = [
    path("make_move/", make_move_view, name="make_move"),
    path("play/", play_view, name="play"),
    path("join_matchmaking/", join_matchmaking_view, name="join_matchmaking"),
    path("cancel_matchmaking/", cancel_matchmaking_view, name="cancel_matchmaking"),
    path("finished_game/", finished_game_view, name="finished_game"),
]
