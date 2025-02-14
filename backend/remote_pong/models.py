from django.conf import settings
from django.db import models

# for pairing up players
class MatchmakingQueue(models.Model):
    player = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="matchmaking_queue"
    )
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player.username} in matchmaking queue"

# for active game sessions
class GameSession(models.Model):
    STATUS_CHOICES = [
        ("ongoing", "Ongoing"),
        ("completed", "Completed"),
        ("abandoned", "Abandoned"),
    ]

    player1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="player1_games", on_delete=models.CASCADE)
    player2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="player2_games", on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="ongoing")
    score_player1 = models.PositiveIntegerField(default=0)
    score_player2 = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Game {self.id} - {self.player1} vs {self.player2}"
