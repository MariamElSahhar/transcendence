from django.db import models
from django.utils import timezone
from users.models import CustomUser


class RemoteGameLog(models.Model):
    GAME_TYPES = [
        ("PONG", "Pong"),
        ("TIC-TAC-TOE", "Tic-Tac-Toe"),
    ]

    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(default=timezone.now)
    game_type = models.CharField(max_length=15, choices=GAME_TYPES)

    users = models.ManyToManyField(CustomUser, related_name="remote_games")
    loserID = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="games_lost",
    )
    winnerID = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="games_won"
    )

    winner_score = models.IntegerField(default=0)
    loser_score = models.IntegerField(default=0)

    def get_my_score(self, username):
        """Get the score of the user based on the provided username."""
        user = CustomUser.objects.filter(username=username).first()
        if not user:
            return None

        if self.winnerID == user:
            return self.winner_score
        elif self.loserID == user:
            return self.loser_score
        return None

    def get_opponent_score(self, username):
        """Get the opponent's score based on the provided username."""
        user = CustomUser.objects.filter(username=username).first()
        if not user:
            return None

        if self.winnerID == user:
            return self.loser_score
        elif self.loserID == user:
            return self.winner_score
        return None

    def is_win_for_user(self, username):
        """Check if the user with the provided username is the winner."""
        user = CustomUser.objects.filter(username=username).first()
        return self.winnerID == user

    def __str__(self):
        winner = self.winnerID.username if self.winnerID else "Unknown"
        loser = self.loserID.username if self.loserID else "Unknown"
        return f"{self.game_type} | Winner: {winner} | Loser: {loser}"


class LocalGameLog(models.Model):
    users = models.ManyToManyField(CustomUser, related_name="local_games")
    game_type = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    localOpponent = models.CharField(max_length=100, null=True, blank=True)
    tournamentID = models.CharField(max_length=100, null=True, blank=True)

    my_score = models.PositiveIntegerField()
    opponent_score = models.PositiveIntegerField()

    @property
    def score(self):
        return f"{self.my_score } / {self.opponent_score }"

    def __str__(self):
        return f"{self.game_type} - {self.date}"
