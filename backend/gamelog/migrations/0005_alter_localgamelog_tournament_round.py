# Generated by Django 5.1.1 on 2025-02-19 12:52

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gamelog", "0004_alter_localgamelog_tournament_round"),
    ]

    operations = [
        migrations.AlterField(
            model_name="localgamelog",
            name="tournament_round",
            field=models.IntegerField(
                blank=True,
                null=True,
                validators=[
                    django.core.validators.MaxValueValidator(3),
                    django.core.validators.MinValueValidator(1),
                ],
            ),
        ),
    ]
