from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField()
    avatar = models.ImageField(upload_to='images/', null=True)

    is_email_verified = models.BooleanField(default=True)
    email_otp = models.CharField(max_length=6, null=True, blank=True)
    enable_otp = models.BooleanField(default=False)
    otp_created_at = models.DateTimeField(null=True, blank=True)

    friends = models.ManyToManyField('self', symmetrical=True, blank=True)

    def __str__(self):
        return self.username

    def get_friends(self):
        return self.friends.all()
