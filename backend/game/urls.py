from django.urls import path
from .views.gamelog import gamelog, gamelog_local, gamelog_remote

urlpatterns = [
    path("gamelog/", gamelog, name="gamelog"),
    path("gamelog/local", gamelog_local, name="gamelog_local"),
    path("gamelog/remote", gamelog_remote, name="gamelog_remote"),
]
