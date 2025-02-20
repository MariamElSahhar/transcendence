from django.contrib import admin
from .models import MatchmakingQueue, GameSession

# Register your models here.
@admin.register(MatchmakingQueue)
class MatchmakingQueue(admin.ModelAdmin):
    list_display = (
        "player",
        "joined_at",
        "systemID"
    )
@admin.register(GameSession)
class GameSession(admin.ModelAdmin):
    list_display = (
        "STATUS_CHOICES",
        "player1",
        "player2",
        "status",
        "score_player1",
        "score_player2",
    )
