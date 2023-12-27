import usocket
import ussl

from config import config

IOT_BROKER_URL = config["IOT_BROKER_URL"]
IOT_CLIENT_CERT = config["IOT_CLIENT_CERT"]
IOT_CLIENT_KEY = config["IOT_CLIENT_KEY"]
#IOT_BROKER_CA = config["IOT_BROKER_CA"]

def send_post(topic, data):
    host = IOT_BROKER_URL
    port = 8443
    url = '/topics/' + topic
    method = 'POST'
    headers = {'Content-Type': 'application/json'}   
    cert_file = IOT_CLIENT_CERT
    key_file = IOT_CLIENT_KEY
    
    # AWS IoT Configuration
    #host = 'xxxx.iot.us-east-1.amazonaws.com'
    #url = '/topics/fridge/door-event'

    #data = '{"test": "1234"}'
    #cert_file = '/path/to/cert.pem'  # Update with actual path
    #key_file = '/path/to/key.pem'    # Update with actual path

    return send_https_request(host, port, url, method, headers, data, cert_file, key_file)


def send_https_request(host, port, url, method, headers, data, cert_file, key_file):
    # Create a socket and wrap it in SSL
    s = usocket.socket()
    s.connect((host, port))
    ssl_sock = ussl.wrap_socket(s, keyfile=key_file, certfile=cert_file, server_side=False)

    # Construct the request
    request = f'{method} {url} HTTP/1.0\r\n'
    for header in headers:
        request += f'{header}: {headers[header]}\r\n'
    request += "\r\n"
    if data:
        request += data

    # Send the request
    ssl_sock.write(request)

    # Receive the response
    response = ssl_sock.read(1024)

    # Close the socket
    ssl_sock.close()
    s.close()

    return response

