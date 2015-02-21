from django.contrib import admin
from custom_user.admin import EmailUserAdmin
from models import Advertiser, Profile, Campaign, AnonymousProfile, Demographic, Agent, Advert, PhoneUser


class AdvertiserAdmin(EmailUserAdmin):
    pass

admin.site.register(Advertiser, AdvertiserAdmin)
admin.site.register(Profile)
admin.site.register(Campaign)
admin.site.register(AnonymousProfile)
admin.site.register(Demographic)
admin.site.register(Agent)
admin.site.register(Advert)
admin.site.register(PhoneUser)