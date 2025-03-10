from django.db import models
from django.utils import timezone
from users.models import CustomUser
from django.core.validators import MaxValueValidator, MinValueValidator


class RemoteGameLog(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(default=timezone.now)

    users = models.ManyToManyField(CustomUser, related_name="remote_games")
    loser = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="games_lost",
    )
    winner = models.ForeignKey(
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

        if self.winner == user:
            return self.winner_score
        elif self.loser == user:
            return self.loser_score
        return None

    def get_opponent_score(self, username):
        """Get the opponent's score based on the provided username."""
        user = CustomUser.objects.filter(username=username).first()
        if not user:
            return None

        if self.winner == user:
            return self.loser_score
        elif self.loser == user:
            return self.winner_score
        return None

    def is_win_for_user(self, username):
        """Check if the user with the provided username is the winner."""
        user = CustomUser.objects.filter(username=username).first()
        return self.winner == user

    def __str__(self):
        winner = self.winner.username if self.winner else "Unknown"
        loser = self.loser.username if self.loser else "Unknown"
        return f"Remote game | Winner: {winner} | Loser: {loser}"


class LocalGameLog(models.Model):
    users = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="local_games"
    )
    date = models.DateTimeField(auto_now_add=True)
    opponent_username = models.CharField(max_length=100, default="Player2")
    tournament_round = models.IntegerField(null=True, blank=True, validators=[MaxValueValidator(3), MinValueValidator(1)])
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
    player1 = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ttt_games_lost",
    )
    player2 = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="ttt_games_won",
    )

    player1_score = models.PositiveIntegerField(default=0)
    player2_score = models.PositiveIntegerField(default=0)

    def get_my_score(self, user_id):
        """Get the score of the user based on the provided id."""
        return self.player1_score if self.player1 and user_id == self.player1.id else self.player2_score

    def get_opponent_score(self, user_id):
        """Get the opponent's score based on the provided username."""
        if not self.player1:
            return self.player1_score
        elif not self.player2:
            return self.player2_score
        else:
            return self.player2_score if user_id == self.player1.id else self.player1_score

    def __str__(self):
        if self.player1_score == self.player2_score:
            return f"Tictactoe Game | Draw | {self.player1.id} vs {self.player2.id}"
        else:
            winner = self.player1.id if self.player1_score > self.player2_score else self.player2.id
            loser = self.player1.id if self.player1_score < self.player2_score else self.player2.id
            return f"Tictactoe Game | Winner: {winner} | Loser: {loser}"
