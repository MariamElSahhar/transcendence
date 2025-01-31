from django.db import models
from django.utils import timezone
from users.models import CustomUser


class RemoteGameLog(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(default=timezone.now)

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
        related_name="games_won",
    )

    winner_score = models.PositiveIntegerField(default=0)
    loser_score = models.PositiveIntegerField(default=0)

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
        return f"Remote game | Winner: {winner} | Loser: {loser}"


class LocalGameLog(models.Model):
    users = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="local_games"
    )
    date = models.DateTimeField(auto_now_add=True)
    opponent_username = models.CharField(max_length=100, default="Player2")
    tournamentID = models.CharField(max_length=100, null=True, blank=True)

    my_score = models.PositiveIntegerField(default=0)
    opponent_score = models.PositiveIntegerField(default=0)

    def is_win_for_user(self):
        """Check if the user with the provided username is the winner."""
        return self.my_score > self.opponent_score

    def __str__(self):
        return f"Local game - {self.date}"


class TicTacToeLog(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(default=timezone.now)

    users = models.ManyToManyField(CustomUser, related_name="ttt_games")
    loserID = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ttt_games_lost",
    )
    winnerID = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ttt_games_won",
    )

    winner_score = models.PositiveIntegerField(default=0)
    loser_score = models.PositiveIntegerField(default=0)

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
        return f"Tictactoe Game | Winner: {winner} | Loser: {loser}"
