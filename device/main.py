from machine import Pin, PWM, Timer
import machine
import time
import ntptime
import json
import ubinascii
from utime import sleep
import urequests
import onewire, ds18x20
from time import sleep

import wifi
from config import config
import logger

# For development only.
#logger.enable_log_file()
#logger.info("---- begin execution -----")

DEVICE_ID = ubinascii.hexlify(machine.unique_id())
logger.info(f"Device ID: {DEVICE_ID}")

API_URL_DOOR_EVENTS = config["API_ENDPOINT"] + "/door-events"
API_URL_TEMP_EVENTS = config["API_ENDPOINT"] + "/temperature-events"
BUZZER_FREQUENCY = 262 # C4 note == 262

def buzzer_on(frequency):
    DOOR_BUZZER_PIN.duty_u16(1000)
    DOOR_BUZZER_PIN.freq(frequency)

def buzzer_off():
    DOOR_BUZZER_PIN.duty_u16(0)

DOOR_PIN = Pin(14, Pin.IN, Pin.PULL_UP)

door_buzzer_pin = Pin(15, Pin.OUT)
DOOR_BUZZER_PIN = PWM(door_buzzer_pin)
buzzer_off()

ds_pin = Pin(22)
DS_SENSOR = ds18x20.DS18X20(onewire.OneWire(ds_pin))
DS_ROMS = DS_SENSOR.scan()

if len(DS_ROMS) == 0:
    logger.info("Error: No DS Roms detected.")
    
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


def on_door_event(event_type):
    event_data = json.dumps({
        "deviceId": DEVICE_ID,
        "timestamp": get_now(),
        "eventType": event_type,
    })
    logger.info("on_door_event: %s", event_data)
    
    headers = {'Content-Type': 'application/json'}

    try:
        response = urequests.post(API_URL_DOOR_EVENTS, data=event_data, headers=headers)
        if response.status_code != 200:
            logger.info("Door event post failure: %s - %s", response.status_code, response.text)
    finally:
        response.close()

def on_temperature_event(temp):
    event_data = json.dumps({
        "deviceId": DEVICE_ID,
        "timestamp": get_now(),
        "value": temp,
    })
    logger.info("on_temperature_event: %s", event_data)
    
    headers = {'Content-Type': 'application/json'}

    try:
        response = urequests.post(API_URL_TEMP_EVENTS, data=event_data, headers=headers)
        if response.status_code != 200:
            logger.info("Temperature event post failure: %s - %s", response.status_code, response.text)
    finally:
        response.close()


def read_temperature(timer):
    DS_SENSOR.convert_temp()
    time.sleep(1)
    for rom in DS_ROMS:
        temp = DS_SENSOR.read_temp(rom)
        on_temperature_event(temp)
        break


def main_loop():
    prev_door_status = DOOR_PIN.value()
    door_last_open_time = None
    is_door_buzzer_on = False

    while True:
        door_status = DOOR_PIN.value()
        if door_status != prev_door_status:
            if door_status:
                on_door_event("open")
                door_last_open_time = time.ticks_ms()
            else:
                if is_door_buzzer_on:
                    buzzer_off()
                    is_door_buzzer_on = False
                    #logger.info("Buzzer OFF")
                    
                on_door_event("close")
                door_last_open_time = None

            prev_door_status = door_status

        if door_last_open_time is not None and not is_door_buzzer_on:
            time_open = time.ticks_diff(time.ticks_ms(), door_last_open_time)
            time_before_warning_ms = config["DOOR_OPEN_TIME_BEFORE_WARNING_IN_SECONDS"] * 1000
            if time_open > time_before_warning_ms:
                buzzer_on(BUZZER_FREQUENCY)
                is_door_buzzer_on = True
                #logger.info("Buzzer ON")
                
        time.sleep(0.1)

# TODO: wlan re-connect logic
wlan = wifi.connect_wlan()

setup_time()

logger.info("Application started.")

temperature_read_period_ms = config["TEMPERATURE_READ_FREQUENCY_IN_SECONDS"] * 1000
logger.info("Temperature read period: %s", config["TEMPERATURE_READ_FREQUENCY_IN_SECONDS"])

temperature_timer = Timer(-1)
temperature_timer.init(period=temperature_read_period_ms, mode=Timer.PERIODIC, callback=read_temperature)

try:
    main_loop()
except KeyboardInterrupt:
    logger.info("Application terminated.")
    temperature_timer.deinit()

