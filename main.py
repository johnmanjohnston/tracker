from datetime import datetime
import re
import requests
import time
import sys

dataURL = "http://ipinfo.io"

with open("logtemplate.txt", "r") as f:
    LOG_TEMPLATE = f.read()


def get_data(): 
    req_data = requests.get(dataURL).json()

    data = f"""
IP: {req_data["ip"]}
Hostname: {req_data["hostname"]}

Country Code: {req_data["country"]}
City: {req_data["city"]}
Region: {req_data["region"]}

Latitude: {req_data["loc"].split(",")[0]}
Longitude: {req_data["loc"].split(",")[1]}

Postal Code: {req_data["postal"]}
Timezone: {req_data["timezone"]}
    """

    log_data(data)

def main():
    get_data()

    while True:
        try:
            time.sleep(5)
            get_data()
        except (KeyboardInterrupt, EOFError):
            print("\nStopping logging...")  
            sys.exit(0)

def log_data(data):
    with open("log.log", "a") as alog:
        alog.write(f"Attempting to get data, {datetime.now()}\n")

        with open("log.log", "r") as rlog:
            log_count = len(re.findall("NEW LOG", rlog.read()))
            log_id = hex(log_count)

        to_log = LOG_TEMPLATE.replace("LOGID", log_id).replace("DATE", str(datetime.now()))
        to_log = to_log.replace("DATA", data)

        alog.write(to_log)

if __name__ == "__main__":
    main()