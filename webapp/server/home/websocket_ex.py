from ws4py.client.threadedclient import WebSocketClient
import json
import requests

anon_id = "FB097528D83245D282B8E24E89C2BD77"
device_id = "574ebf47411f97fd"


class BasicClient(WebSocketClient):

    def opened(self):
        msg = {'deviceId': device_id}
        msg = json.dumps(msg)
        self.send(msg)

    def closed(self, code, reason):
        pass

    def received_message(self, m):
        #Recieved request for advert

        #Get advert using c
        # ode on phone
        params = {'anon_id': anon_id}
        advert_id = requests.get("http://146.169.47.78:55071/advert", params=params).text

        msg = {'advertId': advert_id}
        msg = json.dumps(msg)
        self.send(msg)

ws = BasicClient('ws://146.169.47.78:55070/ws')
ws.connect()
ws.run_forever()
