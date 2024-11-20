from django.urls import path
from .views.gamelog import gamelog_view

urlpatterns = [
    path("gamelog/", gamelog_view, name="gamelog"),
]
