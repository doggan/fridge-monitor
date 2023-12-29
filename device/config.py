# These values must be configured for usage.
config = {
    # Network name.
    "WLAN_SSID": 'XXXXX',
    # Network password.
    "WLAN_PASSWORD": 'XXXXX',
    
    # API endpoint URL for AWS API Gateway to post events.
    "API_ENDPOINT": "https://XXXXX.us-east-1.amazonaws.com/release",

    # Number of seconds the door is open before playing the warning buzzer.
    "DOOR_OPEN_TIME_BEFORE_WARNING_IN_SECONDS": 15,
    
    # How often to collect temperature data.
    "TEMPERATURE_READ_FREQUENCY_IN_SECONDS": 60,
    
    #"TIMEZONE": "America/Los_Angeles",
    # TODO: changes between -7 and -8 depending on daylight savings. need a better automated way to handle this,
    # but the pico doesn't have timezone data. we could query an external API periodically to read this in.
    #"TIMEZONE_UTC_OFFSET_SECONDS": -8 * 60 * 60,
}
