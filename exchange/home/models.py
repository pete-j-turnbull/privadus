from django.db import models


class Request(models.Model):
    deviceId = models.CharField(max_length=50)
    advertUrl = models.CharField(max_length=200)
    serviced = models.BooleanField(default=False)