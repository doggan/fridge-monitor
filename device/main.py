from machine import Pin, PWM
import machine
import time
import ntptime
import json
import ubinascii
from utime import sleep

import wifi
import https
from config import config
import logger


# For development only.
logger.enable_log_file()
logger.info("---- begin execution -----")

IOT_DOOR_TOPIC = "fridge/door-event"
IOT_TEMPERATURE_TOPIC = "fridge/temperature"

DEVICE_ID = ubinascii.hexlify(machine.unique_id())

door = Pin(14, Pin.IN, Pin.PULL_UP)
buzzer = Pin(15, Pin.OUT)
#buzzer = PWM(Pin(15))

wlan = wifi.connect_wlan()
# TODO: wlan re-connect logic

DOOR_OPEN_TIME_BEFORE_WARNING_IN_SECONDS = 15

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

def door_update(event_handler):
    prev_door_status = door.value()
    door_last_open_time = None

    while True:
        door_status = door.value()
        if door_status != prev_door_status:
            if door_status:
                event_handler("open")
                
                door_last_open_time = time.ticks_ms()
            else:
                event_handler("close")
            prev_door_status = door_status
        time.sleep(0.1)
        
        if door_status:
            if door_last_open_time is not None and time.ticks_diff(time.ticks_ms(), door_last_open_time) > DOOR_OPEN_TIME_BEFORE_WARNING_IN_SECONDS * 1000:
                buzzer.high()
        else:
            buzzer.low()

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
    evt = build_msg_door_event(event_type)
    logger.info("# on_door_event: %s", evt)
    
    res = https.send_post(IOT_DOOR_TOPIC, evt)
    print("### res: ", res)
    

door_update(on_door_event)



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



