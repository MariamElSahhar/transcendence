from django.db import models
from users.models import CustomUser


class GameModel(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="games")
    game_type = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    tournamentID = models.CharField(max_length=100, null=True, blank=True)
    winnerID = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="won_games",
    )
    loserID = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="lost_games",
    )

    localgame = models.BooleanField(default=True)

    score_numerator = models.PositiveIntegerField()
    score_denominator = models.PositiveIntegerField()

    @property
    def score(self):
        return f"{self.score_numerator } / {self.score_denominator}"

    def __str__(self):
        return f"{self.game_type} - {self.user.username}"
