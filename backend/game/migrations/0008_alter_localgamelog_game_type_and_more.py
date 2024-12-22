# Generated by Django 5.1.1 on 2024-12-21 10:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("game", "0007_rename_localopponent_localgamelog_opponent_username"),
    ]

    operations = [
        migrations.AlterField(
            model_name="localgamelog",
            name="game_type",
            field=models.CharField(default="Local", max_length=15),
        ),
        migrations.AlterField(
            model_name="localgamelog",
            name="opponent_username",
            field=models.CharField(default="Player2", max_length=100),
        ),
    ]