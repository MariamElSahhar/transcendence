from django.db import models

# Create your models here.
class User(models.Model):
	realname = models.CharField()
	username = models.CharField()
	password = models.CharField()

