from django.conf.urls import patterns, url
import views

urlpatterns = patterns('',
        url(r'^$', views.index, name='index'),
        url(r'^signin/$', views.signin, name='signin'),
        url(r'^signout/$', views.signout, name='signout'),
        url(r'^video/$', views.signin, name='video'),
        url(r'^advertiser/$', views.signin, name='advertiser'),
        url(r'^about/$', views.signin, name='about'),

)