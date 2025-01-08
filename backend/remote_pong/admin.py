from django.contrib import admin
from .models import MatchmakingQueue, GameSession

# Register your models here.
@admin.register(MatchmakingQueue)
class MatchmakingQueue(admin.ModelAdmin):
    list_display = (
        "player",
        "joined_at",
    )
