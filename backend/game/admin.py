from django.contrib import admin
from game.models import RemoteGameLog, LocalGameLog, TicTacToeLog


@admin.register(RemoteGameLog)
class RemoteGameAdmin(admin.ModelAdmin):
    list_display = (
        "get_users",
        "game_type",
        "date",
        "winnerID",
        "loserID",
        "winner_score",
        "loser_score",
    )

    def get_users(self, obj):
        return ", ".join([user.username for user in obj.users.all()])
    get_users.short_description = "Users"


@admin.register(LocalGameLog)
class LocalGameAdmin(admin.ModelAdmin):
    list_display = (
        "users",
        "game_type",
        "date",
        "opponent_username",
        "tournamentID",
        "my_score",
        "opponent_score",
    )


@admin.register(TicTacToeLog)
class TicTacToeAdmin(admin.ModelAdmin):
    list_display = (
        "users",
        "game_type",
        "date",
        "opponent_username",
        "my_score",
        "opponent_score",
    )

    def get_users(self, obj):
        return ", ".join([user.username for user in obj.users.all()])
    get_users.short_description = "Users"
