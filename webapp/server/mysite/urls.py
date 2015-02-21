from django.conf.urls import patterns, include, url
from django.contrib import admin
from tastypie.api import Api
from home.api import UserResource, ProfileResource, CampaignResource,\
    AgentResource, AdvertResource, AnonymousProfileResource, DemographicResource, PhoneUserResource
from django.conf import settings
from django.conf.urls.static import static
admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(UserResource())
v1_api.register(ProfileResource())
v1_api.register(CampaignResource())
v1_api.register(AgentResource())
v1_api.register(AnonymousProfileResource())
v1_api.register(DemographicResource())
v1_api.register(AdvertResource())
v1_api.register(PhoneUserResource())


urlpatterns = patterns('',
                       url(r'^', include('home.urls', namespace="index")),
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^api/', include(v1_api.urls)),
                       ) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
