# These values must be configured for usage.
config = {
    # Network name.
    "WLAN_SSID": 'XXXXX',
    # Network password.
    "WLAN_PASSWORD": 'XXXXX',
    
    # URL for broker (found in AWS console).
    "IOT_BROKER_URL": "https://XXX.amazonaws.com",
    # Broker certificate authority.
    "IOT_BROKER_CA": "AmazonRootCA1.pem",
    # Client key file (renamed from XXXXXX-private.pem.key).
    "IOT_CLIENT_KEY": "private.pem.key",
    # Client cert file (renamed from XXXXXX-certificate.pem.crt).
    "IOT_CLIENT_CERT": "certificate.pem.crt",
    
    # TODO:
#    "ENABLE_DOOR_BUZZER": True,
#    "ENABLE_DOOR_EVENTS": True,
#    "ENABLE_TEMPERATURE_EVENTS": True,
    
    #"TIMEZONE": "America/Los_Angeles",
    # TODO: changes between -7 and -8 depending on daylight savings. need a better automated way to handle this,
    # but the pico doesn't have timezone data. we could query an external API periodically to read this in.
    #"TIMEZONE_UTC_OFFSET_SECONDS": -8 * 60 * 60,
}
