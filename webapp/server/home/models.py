from django.db import models
from custom_user.models import AbstractEmailUser
from django.conf import settings
from django.db import IntegrityError
import uuid


class Advertiser(AbstractEmailUser):
    def __unicode__(self):
        return self.email


class Profile(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    name = models.CharField(max_length=50)
    organisation = models.CharField(max_length=50)
    address = models.TextField()
    description = models.TextField()
    walletId = models.CharField(max_length=100)


class Campaign(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __unicode__(self):
        return self.name


class Agent(models.Model):
    campaign = models.ForeignKey(Campaign)
    name = models.CharField(max_length=100)
    budget = models.DecimalField(max_digits=11, decimal_places=2)
    audience = models.IntegerField()
    # How many times would you like a user to see each ad?

    active = models.BooleanField(default=False)


class AnonymousProfile(models.Model):
    anonId = models.CharField(max_length=64, blank=True, editable=False, unique=True)
    gender = models.CharField(max_length=1)
    age = models.IntegerField()
    latitude = models.DecimalField(max_digits=11, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)

    def save(self, *args, **kwargs):
        if not self.anonId:
            self.anonId = str(uuid.uuid4().get_hex().upper()[0:64])
            # using your function as above or anything else
        success = False
        failures = 0
        while not success:
            try:
                super(AnonymousProfile, self).save(*args, **kwargs)
            except IntegrityError:
                failures += 1
                if failures > 5:  # or some other arbitrary cutoff point at which things are clearly wrong
                    raise
                else:
                    # looks like a collision, try another random value
                    self.anonId = str(uuid.uuid4().get_hex().upper()[0:64])
            else:
                success = True


class Demographic(models.Model):
    agent = models.ForeignKey(Agent)
    anonProfiles = models.ManyToManyField(AnonymousProfile)

    min_age = models.IntegerField()
    max_age = models.IntegerField()
    latitude = models.DecimalField(max_digits=11, decimal_places=3)
    longitude = models.DecimalField(max_digits=11, decimal_places=3)
    radius = models.DecimalField(max_digits=10, decimal_places=4)
    MALE = 'M'
    FEMALE = 'F'

    BOTH = 'B'
    GENDER_CHOICES = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (BOTH, 'Both'),
    )
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default=BOTH)


class Advert(models.Model):
    campaign = models.ForeignKey(Campaign)
    image_path = models.CharField(max_length=256)


class Voucher(models.Model):
    campaign = models.ForeignKey(Campaign)
    image_path = models.CharField(max_length=256)
    b_address = models.CharField(max_length=256)
    expiry_date = models.DateTimeField()
    creation_date = models.DateTimeField()
    issued = models.BooleanField(default=False)


class PhoneUser(models.Model):
    deviceId = models.CharField(max_length=30)
    socketId = models.CharField(max_length=100)
    waddress = models.CharField(max_length=100)
