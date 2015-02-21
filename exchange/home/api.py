from tastypie.resources import ModelResource
from tastypie import fields
from tastypie.authorization import Authorization

from home.models import Request


class RequestResource(ModelResource):

    class Meta:
        queryset = Request.objects.all()
        always_return_data = True
        resource_name = 'request'
        allowed_methods = ['get', 'post']
        authorization = Authorization()


