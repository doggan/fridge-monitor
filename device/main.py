import ssl
import time

import machine
import network
import ntptime
import ubinascii
from machine import Timer
from simple import MQTTClient
from config import config

#MQTT_CLIENT_ID = ubinascii.hexlify(machine.unique_id())

# MQTT topic constants
MQTT_LED_TOPIC = "picow/led"
MQTT_BUTTON_TOPIC = "picow/button"


# function that reads PEM file and return byte array of data
def read_pem(file):
    with open(file, "r") as input:
        text = input.read().strip()
        split_text = text.split("\n")
        base64_text = "".join(split_text[1:-1])

        return ubinascii.a2b_base64(base64_text)


# callback function to handle received MQTT messages
def on_mqtt_msg(topic, msg):
    # convert topic and message from bytes to string
    topic_str = topic.decode()
    msg_str = msg.decode()

    print(f"RX: {topic_str}\n\t{msg_str}")

    # process message
    if topic_str is MQTT_LED_TOPIC:
        if msg_str is "on":
            led.on()
        elif msg_str is "off":
            led.off()
        elif msg_str is "toggle":
            led.toggle()


# callback function to handle changes in button state
# publishes "released" or "pressed" message
def publish_mqtt_button_msg(t):
    topic_str = MQTT_BUTTON_TOPIC
    msg_str = "released" if button.value() else "pressed"

    print(f"TX: {topic_str}\n\t{msg_str}")
    mqtt_client.publish(topic_str, msg_str)

def publish_mqtt_hello_world():
    topic_str = MQTT_BUTTON_TOPIC
    msg_str = "hello world"

    print(f"TX: {topic_str}\n\t{msg_str}")
    mqtt_client.publish(topic_str, msg_str)


# callback function to periodically send MQTT ping messages
# to the MQTT broker
def send_mqtt_ping(t):
    print("TX: ping")
    mqtt_client.ping()


# read the data in the private key, public certificate, and
# root CA files
key = read_pem(MQTT_CLIENT_KEY)
cert = read_pem(MQTT_CLIENT_CERT)
ca = read_pem(MQTT_BROKER_CA)

# create pin objects for on-board LED and external button
#led = Pin("LED", Pin.OUT)
#button = Pin(3, Pin.IN, Pin.PULL_UP)

# initialize the Wi-Fi interface
wlan = network.WLAN(network.STA_IF)

# create MQTT client that use TLS/SSL for a secure connection
mqtt_client = MQTTClient(
    MQTT_CLIENT_ID,
    MQTT_BROKER,
    keepalive=60,
    ssl=True,
    ssl_params={
        "key": key,
        "cert": cert,
        "server_hostname": MQTT_BROKER,
        "cert_reqs": ssl.CERT_REQUIRED,
        "cadata": ca,
    },
)

print(f"Connecting to Wi-Fi SSID: {WIFI_SSID}")

# activate and connect to the Wi-Fi network:
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASSWORD)

while not wlan.isconnected():
    time.sleep(0.5)

print(f"Connected to Wi-Fi SSID: {WIFI_SSID}")

# update the current time on the board using NTP
ntptime.settime()

print(f"Connecting to MQTT broker: {MQTT_BROKER}")

# register callback to for MQTT messages, connect to broker and
# subscribe to LED topic
mqtt_client.set_callback(on_mqtt_msg)
mqtt_client.connect()
mqtt_client.subscribe(MQTT_LED_TOPIC)

print(f"Connected to MQTT broker: {MQTT_BROKER}")

# register callback function to handle changes in button state
#button.irq(publish_mqtt_button_msg, Pin.IRQ_FALLING | Pin.IRQ_RISING)

publish_mqtt_hello_world()

# turn on-board LED on
#led.on()

# create timer for periodic MQTT ping messages for keep-alive
mqtt_ping_timer = Timer(
    mode=Timer.PERIODIC, period=mqtt_client.keepalive * 1000, callback=send_mqtt_ping
)

# main loop, continuously check for incoming MQTT messages
while True:
    mqtt_client.check_msg()
    
    
    
    import machine, onewire, ds18x20
from time import sleep
 
ds_pin = machine.Pin(2)
 
ds_sensor = ds18x20.DS18X20(onewire.OneWire(ds_pin))
 
roms = ds_sensor.scan()
 
print('Found DS devices')
print('Temperature (°C)')
 
while True:
 
  ds_sensor.convert_temp()
 
  sleep(1)
 
  for rom in roms:
 
    print(ds_sensor.read_temp(rom))
 
  sleep(3)
  
"""
from machine import Pin
import time
import socket
import network

door = Pin(14, Pin.IN, Pin.PULL_UP)
#button = Pin(13, Pin.IN, Pin.PULL_UP)    #Create button object from Pin13 , Set GP13 to input

prev_door_status = door.value()

while True:
    door_status = door.value()
#    print("raw status: " + str(door_status))
    if door_status != prev_door_status:
        if door_status:
            print("Open")
        else:
            print("Closed")
        prev_door_status = door_status
    time.sleep(0.1)
"""



