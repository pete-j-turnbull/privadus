from __future__ import absolute_import
from time import sleep
from requests import get, post
from celery import shared_task
from home.models import Request
import cherrypy


@shared_task
def start_exchange_server():

    cherrypy.config.update({'server.socket_host': '146.169.47.78',
                            'server.socket_port': 55056, })

    class ExchangeServer(object):

        @cherrypy.expose
        def post_ad(self, request_id, ad_url):
            request = Request.objects.filter(id=int(request_id)).first()
            request.advertUrl = ad_url
            request.serviced = True
            request.save()


        @cherrypy.expose
        def request_ad(self, device_id):
            request = Request(deviceId=device_id, serviced=False, advertUrl='')
            request.save()
            request_id = request.id

            while True:
                request = Request.objects.get(id=request_id)
                if request.serviced:
                    break

            #Request is now serviced
            advert_url = request.advertUrl
            return str(advert_url)

    cherrypy.quickstart(ExchangeServer())


