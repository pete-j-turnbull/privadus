from __future__ import absolute_import
from time import sleep
from requests import get, post
from celery import shared_task, task
from home.models import Profile, Campaign, Demographic, Agent, Advert, PhoneUser, AnonymousProfile
import cherrypy
from tornado import websocket, web, ioloop
import json
from multiprocessing import Manager
import thread
import mysql.connector

manager = Manager()

websockets = {}
advert_w_list = {}


#This task calls the crpytDB service
def insert(connection, add, data):
        cursor = connection.cursor()

        cursor.execute(add, data)
        connection.commit()

        cursor.close()


def query(connection, query, data):
        matches = []
        cursor = connection.cursor()

        cursor.execute(query, data)

        for sha in cursor:
                matches += sha

        cursor.close()
        return matches


@shared_task
def start_services():
    initial_matcher.delay()
    solve_ads.delay()


@shared_task
def initial_matcher():
    #Pull down all AnonProfiles and all Active Agent's demographics
    active_agents = Agent.objects.filter(active=True)
    for agent in active_agents:
        demographic = agent.demographic_set.first()
        d_gender = demographic.gender
        d_maxage = demographic.max_age
        d_minage = demographic.min_age

        d_anon_ids = get_matches(d_gender, d_maxage, d_minage)
        #For each anon_id, add a relation between d_id and anon_id
        for d_anon_id in d_anon_ids:
            a_profile = AnonymousProfile.objects.get(anonId=d_anon_id)
            demographic.anonProfiles.add(a_profile)


def phone_server():
    cherrypy.config.update({'server.socket_host': '146.169.47.78',
                            'server.socket_port': 55071, })

    class PhoneServer(object):

        @cherrypy.expose
        def advert(self, anon_id):
            print("Server received request for advert from: %s" % anon_id)
            if anon_id == '201D964E7CA744BDAD388B9D1D8C7BDC':
                #Lei - tablet
                return "1"
            else:
                #Chloe - S3
                return "2"

    cherrypy.quickstart(PhoneServer())


def phone_socket_handler():
    global websockets
    global advert_w_list

    class SocketHandler(websocket.WebSocketHandler):

        def __init__(self, *args, **kwargs):
            super(SocketHandler, self).__init__(*args, **kwargs)
            self.device_id = -1

        def check_origin(self, origin):
            return True

        def open(self):
            pass

        def on_message(self, message):
            m = json.loads(message)
            if 'deviceId' in m.keys():
                #On open message
                self.device_id = m['deviceId']
                global websockets
                websockets[self.device_id] = self
            else:
                #Standard message for adverts
                advert_id = m['advertId']
                global advert_w_list
                advert_w_list[self.device_id] = advert_id

        def on_close(self):
            pass

    app = web.Application([(r'/ws', SocketHandler), ])
    app.listen(55070)
    ioloop.IOLoop.instance().start()


def exchange_scraper():
    while True:
        #Get new ad requests
        ad_requests = get("http://146.169.47.78:55055/api/v1/request").json()['objects']

        #For each deviceId attempt to ask phone for advert
        for ad_request in ad_requests:
            if not ad_request['serviced']:
                device_id = ad_request['deviceId']
                print "Ad request from : %s" % device_id
                request_id = ad_request['id']

                global websockets
                global advert_w_list
                if device_id in websockets.keys():
                    dev_websocket = websockets[device_id]
                    advert_w_list[device_id] = -1
                    print("Forwarding ad request to phone websocket...")
                    dev_websocket.write_message('')

                    while advert_w_list[device_id] == -1:
                        pass

                    advert_id = advert_w_list[device_id]
                    print("Phone returned advert ID: %s" % advert_id)

                    try:
                        advert = Advert.objects.get(id=advert_id)
                        advert_url = advert.image_path
                        #Send image to ad request for this deviceId
                        get("http://146.169.47.78:55056/post_ad?request_id=%s&ad_url='%s'" % (request_id, advert_url))
                    except Advert.DoesNotExist:
                        pass
                        #Invalid advert ID - for now do nothing
        sleep(2)



@shared_task
def solve_ads():
    thread.start_new_thread(phone_socket_handler, ())
    thread.start_new_thread(phone_server, ())
    thread.start_new_thread(exchange_scraper, ())


#This task is effectively run by the phone on the server
@shared_task
def get_best_advert(anon_id):
    a_profile = AnonymousProfile.objects.filter(anonId=anon_id).first()
    demographics = a_profile.demographic_set.all()
    demographic = demographics.first()
    advert_id = demographic.agent.campaign.advert_set.first().id
    return advert_id


#This task calls the crpytDB service
@shared_task
def get_matches(gender, maxage, minage):
    cnx = mysql.connector.connect(user='root', password='letmein',
                                  host='146.169.47.78',
                                  port='55060',
                                  database='db_main')

    gender_query = ""

    if gender == 'B':
        gender_query = "(gender = 0 OR gender = 1)"
    elif gender == 'F':
        gender_query = "gender = 0"
    elif gender == 'M':
        gender_query = "gender = 1"

    query = ("SELECT sha FROM user WHERE age > %s AND age < %s AND %s" % (minage, maxage, gender_query))
    matches = query(cnx, query, "")
    cnx.close()
    return matches




