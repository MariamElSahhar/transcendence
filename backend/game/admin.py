from django.contrib import admin
from game.models import GameModel


@admin.register(GameModel)
class GameAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "game_type",
        "date",
        "tournamentID",
        "winnerID",
        "loserID",
        "localgame",
        "score_numerator",
        "score_denominator",
    )
