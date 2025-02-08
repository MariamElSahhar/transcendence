from django.urls import path
from .views import create_gamelog_ttt, gamelog, create_gamelog_local, create_gamelog_remote

urlpatterns = [
    path("users/<int:user_id>/gamelog/", gamelog, name="gamelog"),
    path("gamelog/local/", create_gamelog_local, name="gamelog_local"),
    path("gamelog/ttt/", create_gamelog_ttt, name="gamelog_ttt"),
    path("gamelog/remote/", create_gamelog_remote, name="gamelog_remote"),
]
