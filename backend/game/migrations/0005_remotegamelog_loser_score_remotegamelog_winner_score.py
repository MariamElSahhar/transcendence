# Generated by Django 5.1.1 on 2024-12-19 05:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("game", "0004_remove_remotegamelog_is_win_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="remotegamelog",
            name="loser_score",
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name="remotegamelog",
            name="winner_score",
            field=models.IntegerField(default=0),
        ),
    ]
