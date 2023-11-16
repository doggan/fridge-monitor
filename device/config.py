# These values must be configured for usage.
config = {
    # Network name.
    "WLAN_SSID": 'XXXXX',
    # Network password.
    "WLAN_PASSWORD": 'XXXXX',
    
    "MQTT_CLIENT_KEY": "XXXXX-private.pem.key",
    "MQTT_CLIENT_CERT": "XXXXX-certificate.pem.crt",
    "MQTT_BROKER": "XXXXX.amazonaws.com",
    "MQTT_BROKER_CA": "XXXXX.pem",
    
    #"TIMEZONE": "America/Los_Angeles",
    # TODO: changes between -7 and -8 depending on daylight savings. need a better automated way to handle this,
    # but the pico doesn't have timezone data. we could query an external API periodically to read this in.
    #"TIMEZONE_UTC_OFFSET_SECONDS": -8 * 60 * 60,
}
