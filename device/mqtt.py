import ssl
import machine
import ubinascii
from machine import Timer
from simple import MQTTClient
from config import config
import logger

MQTT_CLIENT_ID = ubinascii.hexlify(machine.unique_id())
MQTT_BROKER = config["MQTT_BROKER"]
MQTT_CLIENT_KEY = config["MQTT_CLIENT_KEY"]
MQTT_CLIENT_CERT = config["MQTT_CLIENT_CERT"]
MQTT_BROKER_CA = config["MQTT_BROKER_CA"]

def publish_event(client, topic_str, msg_str):
    logger.info(f"TX: {topic_str}\n\t{msg_str}")
    client.publish(topic_str, msg_str)

def create_client():
    logger.info(f"Connecting to MQTT broker: {MQTT_BROKER}")
    

    def read_pem_binary(file):
        with open(file, "rb") as f:
            return f.read()
    # function that reads PEM file and return byte array of data
    def read_pem(file):
        with open(file, "r") as input:
            text = input.read().strip()
            split_text = text.split("\n")
            base64_text = "".join(split_text[1:-1])

            return ubinascii.a2b_base64(base64_text)
    
    key = read_pem_binary(MQTT_CLIENT_KEY)
    cert = read_pem_binary(MQTT_CLIENT_CERT)
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
    
    logger.info(f"Connected to MQTT broker: {MQTT_BROKER}")
    return mqtt_client

# Keep-alive is needed to maintain connection to AWS IoT Core during periods of idleness.
def start_keepalive_ping(mqtt_client):
    def send_mqtt_ping(t):
        logger.info("MQTT: ping")
        mqtt_client.ping()
        
    Timer(mode=Timer.PERIODIC, period=mqtt_client.keepalive * 1000, callback=send_mqtt_ping)
