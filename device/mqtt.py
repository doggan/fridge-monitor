import ssl
import machine
import ubinascii
#from machine import Timer
from simple import MQTTClient
from config import config

MQTT_CLIENT_ID = ubinascii.hexlify(machine.unique_id())
MQTT_BROKER = config["MQTT_BROKER"]
MQTT_CLIENT_KEY = config["MQTT_CLIENT_KEY"]
MQTT_CLIENT_CERT = config["MQTT_CLIENT_CERT"]
MQTT_BROKER_CA = config["MQTT_BROKER_CA"]

"""
# callback function to handle changes in button state
# publishes "released" or "pressed" message
def publish_mqtt_button_msg(t):
    topic_str = MQTT_BUTTON_TOPIC
    msg_str = "released" if button.value() else "pressed"

    print(f"TX: {topic_str}\n\t{msg_str}")
    mqtt_client.publish(topic_str, msg_str)

# callback function to periodically send MQTT ping messages
# to the MQTT broker
def send_mqtt_ping(t):
    print("TX: ping")
    mqtt_client.ping()
"""

def publish_event(client, topic_str, msg_str):
    print(f"TX: {topic_str}\n\t{msg_str}")
    client.publish(topic_str, msg_str)

# function that reads PEM file and return byte array of data
def read_pem(file):
    with open(file, "r") as input:
        text = input.read().strip()
        split_text = text.split("\n")
        base64_text = "".join(split_text[1:-1])

        return ubinascii.a2b_base64(base64_text)

def create_client():
    print(f"Connecting to MQTT broker: {MQTT_BROKER}")
    
    key = read_pem(MQTT_CLIENT_KEY)
    cert = read_pem(MQTT_CLIENT_CERT)
    ca = read_pem(MQTT_BROKER_CA)
    
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
    
    mqtt_client.connect()
    
    print(f"Connected to MQTT broker: {MQTT_BROKER}")
    return mqtt_client
    



"""
# create timer for periodic MQTT ping messages for keep-alive
mqtt_ping_timer = Timer(
    mode=Timer.PERIODIC, period=mqtt_client.keepalive * 1000, callback=send_mqtt_ping
)

# main loop, continuously check for incoming MQTT messages
while True:
    mqtt_client.check_msg()
"""
