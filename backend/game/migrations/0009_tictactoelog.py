# Generated by Django 5.1.1 on 2025-01-03 01:39

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("game", "0008_alter_localgamelog_game_type_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="TicTacToeLog",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("game_type", models.CharField(default="TicTacToe", max_length=15)),
                ("date", models.DateTimeField(auto_now_add=True)),
                (
                    "opponent_username",
                    models.CharField(default="Player2", max_length=100),
                ),
                ("my_score", models.PositiveIntegerField(default=0)),
                ("opponent_score", models.PositiveIntegerField(default=0)),
                (
                    "users",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ttt_games",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
