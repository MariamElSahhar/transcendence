from django.urls import path
from .views.gamelog import gamelog, create_gamelog_local, create_gamelog_remote

urlpatterns = [
    path("users/<int:user_id>/gamelog/", gamelog, name="gamelog"),
    path("gamelog/local/", create_gamelog_local, name="gamelog_local"),
    path("gamelog/remote/", create_gamelog_remote, name="gamelog_remote"),
]
