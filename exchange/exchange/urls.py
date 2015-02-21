from django.conf.urls import patterns, include, url
from django.contrib import admin
from tastypie.api import Api

from home.api import RequestResource

admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(RequestResource())


urlpatterns = patterns('',
                       url(r'^index/', include('home.urls', namespace="index")),
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^api/', include(v1_api.urls)),
                       )