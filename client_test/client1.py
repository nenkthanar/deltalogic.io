import paho.mqtt.client as mqtt
import time
from threading import Thread
import json 

host = "deltalogic.io"
port = 1883
client = mqtt.Client()
flag_connected = 0

def on_disconnect(client, userdata, rc):
    global flag_connected
    flag_connected = 0
    print("client disconnected")

def on_connect(self, client, userdata, rc):
    global flag_connected
    print("MQTT Connected.")
    self.subscribe("TEST/MQTT")
    self.subscribe("newuser")

def on_message(client, userdata,msg):
    print(msg.payload.decode("utf-8", "strict"))

client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_connect = on_connect
client.on_message = on_message
client.username_pw_set('deltalogic','deltalogic2020')
client.connect(host = host, port=1883, keepalive=100,bind_address="")

i = 0
while True:
      data = json.dumps({"name":"agv1","status":"load" + str(i)})
      client.loop_start()
      client.publish("TEST/MQTT",data)
      time.sleep(1)
      i+=1

client.loop_stop()



      