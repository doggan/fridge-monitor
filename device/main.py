from machine import Pin, PWM
import machine
import time
import ntptime
import json
import ubinascii
from utime import sleep

import wifi
import mqtt
from config import config
import logger

tones = {
"B0": 31,
"C1": 33,
"CS1": 35,
"D1": 37,
"DS1": 39,
"E1": 41,
"F1": 44,
"FS1": 46,
"G1": 49,
"GS1": 52,
"A1": 55,
"AS1": 58,
"B1": 62,
"C2": 65,
"CS2": 69,
"D2": 73,
"DS2": 78,
"E2": 82,
"F2": 87,
"FS2": 93,
"G2": 98,
"GS2": 104,
"A2": 110,
"AS2": 117,
"B2": 123,
"C3": 131,
"CS3": 139,
"D3": 147,
"DS3": 156,
"E3": 165,
"F3": 175,
"FS3": 185,
"G3": 196,
"GS3": 208,
"A3": 220,
"AS3": 233,
"B3": 247,
"C4": 262,
"CS4": 277,
"D4": 294,
"DS4": 311,
"E4": 330,
"F4": 349,
"FS4": 370,
"G4": 392,
"GS4": 415,
"A4": 440,
"AS4": 466,
"B4": 494,
"C5": 523,
"CS5": 554,
"D5": 587,
"DS5": 622,
"E5": 659,
"F5": 698,
"FS5": 740,
"G5": 784,
"GS5": 831,
"A5": 880,
"AS5": 932,
"B5": 988,
"C6": 1047,
"CS6": 1109,
"D6": 1175,
"DS6": 1245,
"E6": 1319,
"F6": 1397,
"FS6": 1480,
"G6": 1568,
"GS6": 1661,
"A6": 1760,
"AS6": 1865,
"B6": 1976,
"C7": 2093,
"CS7": 2217,
"D7": 2349,
"DS7": 2489,
"E7": 2637,
"F7": 2794,
"FS7": 2960,
"G7": 3136,
"GS7": 3322,
"A7": 3520,
"AS7": 3729,
"B7": 3951,
"C8": 4186,
"CS8": 4435,
"D8": 4699,
"DS8": 4978
}
song = ["E5","G5","A5","P","E5","G5","B5","A5","P","E5","G5","A5","P","G5","E5"]

def playtone(frequency):
    buzzer.duty_u16(1000)
    buzzer.freq(frequency)

def bequiet():
    buzzer.duty_u16(0)

def playsong(mysong):
    for i in range(len(mysong)):
        if (mysong[i] == "P"):
            bequiet()
        else:
            playtone(tones[mysong[i]])
        sleep(0.3)
    bequiet()

# For development only.
logger.enable_log_file()

MQTT_DOOR_TOPIC = "fridge/door-event"
MQTT_TEMPERATURE_TOPIC = "fridge/temperature"

DEVICE_ID = ubinascii.hexlify(machine.unique_id())

door = Pin(14, Pin.IN, Pin.PULL_UP)
#buzzer = Pin(15, Pin.OUT)
buzzer = PWM(Pin(15))

wlan = wifi.connect_wlan()
# TODO: wlan re-connect logic

door_status = "close"
DOOR_OPEN_TIME_BEFORE_WARNING_IN_SECONDS = 10

while 1:
    try:
        # Update the current time on the board using NTP.
        # Needed for SSL connections and timestamp accuracy.
        ntptime.settime()
        break
    except OSError as e:
        print(str("ntptime errornr="),e)
        i += 1
        self.delay(i)

mqtt_client = mqtt.create_client()
mqtt.start_keepalive_ping(mqtt_client)

def door_update(event_handler):
    prev_door_status = door.value()
    door_open_time = 0

    while True:
        door_status = door.value()
        if door_status != prev_door_status:
            if door_status:
                event_handler("open")
                
                door_open_time = time.ticks_ms()
                print("### OPEN")
            else:
                event_handler("close")
            prev_door_status = door_status
        time.sleep(0.1)
        
        if door_status:# == "open":
            print("### DIFF: ", time.ticks_diff(time.ticks_ms(), door_open_time))
            if time.ticks_diff(time.ticks_ms(), door_open_time) > DOOR_OPEN_TIME_BEFORE_WARNING_IN_SECONDS * 1000:
                print("### DIFF: ", )
                #buzzer.high()
                playsong(song)
        else:
            #buzzer.low()
            bequiet()

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
#    if event_type == "open":
#        
#    else:
#        buzzer.low()

    evt = build_msg_door_event(event_type)
    logger.info("# on_door_event: %s", evt)
    mqtt.publish_event(mqtt_client, MQTT_DOOR_TOPIC, evt)
    

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



