# Generated by Django 5.1.1 on 2024-11-05 17:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0004_customuser_enable_otp_alter_customuser_email"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="image",
            field=models.ImageField(null=True, upload_to="images/"),
        ),
    ]