"""
URL configuration for tictactoe project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

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
