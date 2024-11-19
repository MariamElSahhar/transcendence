# Generated by Django 5.1.1 on 2024-11-12 15:21

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0007_customuser_friends"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="is_online",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="customuser",
            name="last_seen",
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
