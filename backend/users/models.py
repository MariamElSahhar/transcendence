from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField()

    is_email_verified = models.BooleanField(default=False)
    email_otp = models.CharField(max_length=6, null=True, blank=True)
    enable_otp = models.BooleanField(default=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.username
