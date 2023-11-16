import network
import time
from config import config

def connect_wlan():
    wlan = network.WLAN(network.STA_IF)
    wlan.disconnect()
    wlan.active(True)
    wlan.connect(config["WLAN_SSID"], config["WLAN_PASSWORD"])
    print('Connecting to a wireless network...')

    while not wlan.isconnected():
        time.sleep(1)
        print('Connecting to a wireless network...')

    print('Successfully connected to wireless network:', config["WLAN_SSID"])
    # print(wlan.ifconfig())

    return wlan
