from machine import Pin, PWM
import machine
import time
import ntptime
import json
import ubinascii
from utime import sleep
import urequests

import wifi
from config import config
import logger

# For development only.
#logger.enable_log_file()
#logger.info("---- begin execution -----")

logger.info(f"Door buzzer enabled: {config["ENABLE_DOOR_BUZZER"]}")
logger.info(f"Door events enabled: {config["ENABLE_DOOR_EVENTS"]}")
logger.info(f"Temperature events enabled: {config["ENABLE_TEMPERATURE_EVENTS"]}")

DEVICE_ID = ubinascii.hexlify(machine.unique_id())
logger.info(f"Device ID: {DEVICE_ID}")

API_URL_DOOR_EVENTS = config["API_ENDPOINT"] + "/door-events"
API_URL_TEMP_EVENTS = config["API_ENDPOINT"] + "/temperature-events"

DOOR_PIN = None
DOOR_BUZZER_PIN = None
if config["ENABLE_DOOR_EVENTS"]:
    DOOR_PIN = Pin(14, Pin.IN, Pin.PULL_UP)
if config["ENABLE_DOOR_BUZZER"]:
    DOOR_BUZZER_PIN = Pin(15, Pin.OUT)

def setup_time():
    logger.info("Setting NTP Time...")
    
    i = 0
    while 1:
        try:
            # Update the current time on the board using NTP.
            # Needed for SSL connections and timestamp accuracy.
            ntptime.settime()
            break
        except OSError as e:
            print(str("ntptime errornr="),e)
            i += 1
            time.sleep(i)

def get_now():
    # For now, just returning the ISO-8601 string in UTC time, since
    # we store UTC time on the server. Our FE can convert to local timezone
    # since we're only dealing with a single device. Ideally, we can register
    # the device timezone, store server data in UTC, and have the FE display logic
    # convert to the device's timezone.
    local_time = time.gmtime()
    iso_time = "{:04d}-{:02d}-{:02d}T{:02d}:{:02d}:{:02d}+00:00".format(
        local_time[0], local_time[1], local_time[2], 
        local_time[3], local_time[4], local_time[5])
    return iso_time

    """
    utcOffsetSeconds = config["TIMEZONE_UTC_OFFSET_SECONDS"]

    # Split out into hour/minute components.
    # 8:30 (8 hours 30 minute UTC offset) -> 30600 utcOffsetSeconds
    # utcOffsetHours == 8
    # utcOffsetMinutes == 30
    utcOffsetHours = int(utcOffsetSeconds / 60 / 60)
    utcOffsetMinutes = (utcOffsetSeconds - (utcOffsetHours * 60 * 60)) // 60
    
    local_time = time.localtime(time.time() + config["TIMEZONE_UTC_OFFSET_SECONDS"])
    
    # ISO 8601 format, e.g. 2023-11-15T17:19:13.233-08:00
    iso_time = "{:04d}-{:02d}-{:02d}T{:02d}:{:02d}:{:02d}{}{:02d}:{:02d}".format(
        local_time[0], local_time[1], local_time[2], 
        local_time[3], local_time[4], local_time[5],
        "+" if utcOffsetSeconds >= 0 else "-", abs(utcOffsetHours), abs(utcOffsetMinutes))
    return iso_time
    """


def build_msg_door_event(event_type):
    return json.dumps({
        "deviceId": DEVICE_ID,
        "timestamp": get_now(),
        "eventType": event_type,
    })

def on_door_event(event_type):
    event_data = build_msg_door_event(event_type)
    #logger.info("on_door_event: %s", event_data)
    
    headers = {'Content-Type': 'application/json'}

    try:
        response = urequests.post(API_URL_DOOR_EVENTS, data=event_data, headers=headers)
        if response.status_code != 200:
            logger.info("Door event post failure: %s - %s", response.status_code, response.text)
    finally:
        response.close()


# TODO: wlan re-connect logic
wlan = wifi.connect_wlan()

setup_time()

logger.info("Begin application...")

prev_door_status = None
door_last_open_time = None

if config["ENABLE_DOOR_EVENTS"]:
    prev_door_status = DOOR_PIN.value()

while True:
    if config["ENABLE_DOOR_EVENTS"]:
        door_status = DOOR_PIN.value()
        if door_status != prev_door_status:
            if door_status:
                on_door_event("open")
                door_last_open_time = time.ticks_ms()
            else:
                on_door_event("close")
            prev_door_status = door_status

    time.sleep(0.1)

    #if config["ENABLE_DOOR_BUZZER"]:
    #if door_status:
    #    if door_last_open_time is not None and time.ticks_diff(time.ticks_ms(), door_last_open_time) > config["DOOR_OPEN_TIME_BEFORE_WARNING_IN_SECONDS"] * 1000:
    #        DOOR_BUZZER_PIN.high()
    #else:
    #    DOOR_BUZZER_PIN.low()



"""
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



