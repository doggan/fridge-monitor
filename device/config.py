# These values must be configured for usage.
config = {
    # Network name.
    "WLAN_SSID": 'XXXXX',
    # Network password.
    "WLAN_PASSWORD": 'XXXXX',
    
    # Converting to DER:
    # openssl x509 -in certificate.pem.crt -out certificate.der -outform DER
    # openssl rsa -in private.pem.key -out private.key.der -outform DER
    "MQTT_CLIENT_KEY": "private.pem.der",
    "MQTT_CLIENT_CERT": "certificate.der",
    "MQTT_BROKER": "XXXXX.amazonaws.com",
    "MQTT_BROKER_CA": "AmazonRootCA1.pem",
    
    #"TIMEZONE": "America/Los_Angeles",
    # TODO: changes between -7 and -8 depending on daylight savings. need a better automated way to handle this,
    # but the pico doesn't have timezone data. we could query an external API periodically to read this in.
    #"TIMEZONE_UTC_OFFSET_SECONDS": -8 * 60 * 60,
}
