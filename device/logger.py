import os
import sys
import time

_stream = sys.stderr  # default output
_format = "%(asctime)s: %(message)s"  # default message format

def enable_log_file():
    # Dump all stdout/stderr to log file.
    # Used during development, since file will grow in size for ever.
    logfile = open('log.txt', 'a')
    os.dupterm(logfile)

def info(message, *args):
    try:
        if args:
            message = message % args
        
        # ref: https://github.com/erikdelange/MicroPython-Logging/blob/main/logging.py
        record = dict()
        record["message"] = message
        tm = time.localtime()
        record["asctime"] = "{:04d}-{:02d}-{:02d} {:02d}:{:02d}:{:02d}" \
            .format(tm[0], tm[1], tm[2], tm[3], tm[4], tm[5])
        
        log_str = _format % record + "\n"
        
        _ = _stream.write(log_str)
        
    except Exception as e:
        print("--- Logging Error ---")
        print(repr(e))
        print("Message: '" + message + "'")
        print("Arguments:", args)
        print("Format String: '" + _format + "'")
        raise e
