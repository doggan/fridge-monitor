import network
import time
from config import config
import logger

def connect_wlan():
    wlan = network.WLAN(network.STA_IF)
    wlan.disconnect()
    wlan.active(True)
    wlan.connect(config["WLAN_SSID"], config["WLAN_PASSWORD"])
    logger.info('Connecting to a wireless network...')

    while not wlan.isconnected():
        time.sleep(1)
        logger.info('Connecting to a wireless network...')

    logger.info('Successfully connected to wireless network: %s', config["WLAN_SSID"])
    # logger.info(wlan.ifconfig())

    return wlan
