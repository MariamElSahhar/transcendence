from django.db import models

class Game(models.Model):
    id = models.AutoField(primary_key=True)

    # Status can be MATCHMAKING, PLAYING, FINISHED
    status = models.CharField(max_length=10, default='MATCHMAKING')

    # If one player isn't there, it means it got deleted, game still exists (ZOMBIE)
    player_1 = models.ForeignKey('users.CustomUser', related_name='player_1', on_delete=models.SET_NULL, null=True)
    player_2 = models.ForeignKey('users.CustomUser', related_name='player_2', on_delete=models.SET_NULL, null=True)

    map_round_1 = models.CharField(max_length=9, default='---------')
    map_round_2 = models.CharField(max_length=9, default='---------')
    map_round_3 = models.CharField(max_length=9, default='---------')

    current_round = models.IntegerField(default=1)

    next_to_play = models.ForeignKey('users.CustomUser', related_name='next_to_play', on_delete=models.SET_NULL, null=True)

    last_play_time = models.DateTimeField(auto_now=True)

    winner_round_1 = models.ForeignKey('users.CustomUser', related_name='winner_round_1', on_delete=models.SET_NULL, null=True) 
    winner_round_2 = models.ForeignKey('users.CustomUser', related_name='winner_round_2', on_delete=models.SET_NULL, null=True) 
    winner_round_3 = models.ForeignKey('users.CustomUser', related_name='winner_round_3', on_delete=models.SET_NULL, null=True)

    game_winner = models.ForeignKey('users.CustomUser', related_name='game_winner', on_delete=models.SET_NULL, null=True)
