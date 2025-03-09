from django.contrib import admin
from gamelog.models import RemoteGameLog, LocalGameLog, TicTacToeLog


@admin.register(RemoteGameLog)
class RemoteGameAdmin(admin.ModelAdmin):
    list_display = (
        "get_users",
        "date",
        "winner",
        "loser",
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
        "date",
        "opponent_username",
        "tournament_round",
        "my_score",
        "opponent_score",
    )
    list_filter = ('users',)


@admin.register(TicTacToeLog)
class TicTacToeAdmin(admin.ModelAdmin):
    list_display = (
        "get_users",
        "date",
        "player1_id",
        "player2_id",
        "player1_score",
        "player2_score",
    )

    def get_users(self, obj):
        return ", ".join([user.username for user in obj.users.all()])
    get_users.short_description = "Users"
