from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta


class CustomUser(AbstractUser):
    email = models.EmailField()
    avatar = models.ImageField(upload_to='images/',  default="default_avatar/default_avatar.jpg", null=True)
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(default=timezone.now)

    is_email_verified = models.BooleanField(default=False)
    email_otp = models.CharField(max_length=6, null=True, blank=True)
    enable_otp = models.BooleanField(default=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.username

    def get_friends(self):
        return self.friends.all()

    def save(self, *args, **kwargs):
        self.check_online_status()
        super().save(*args, **kwargs)

    def check_online_status(self):
        if self.is_online:
            timeout = timezone.now() - timedelta(minutes=5)
            self.is_online = self.last_seen >= timeout

