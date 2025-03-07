# Generated by Django 5.1.1 on 2025-03-05 18:06

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gamelog", "0007_remove_tictactoelog_player1_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name="tictactoelog",
            name="player1_id",
        ),
        migrations.RemoveField(
            model_name="tictactoelog",
            name="player2_id",
        ),
        migrations.AddField(
            model_name="tictactoelog",
            name="player1",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="ttt_games_lost",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="tictactoelog",
            name="player2",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="ttt_games_won",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
