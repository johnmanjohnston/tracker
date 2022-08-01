from datetime import datetime
import re
import requests
import time
import sys
import os

URL = "http://ipinfo.io"
BASEPATH = os.path.dirname(os.path.abspath(__file__))
LOG_TEMPLATE_FILEPATH = os.path.join(BASEPATH, "..", "logtemplate.txt")
LOG_FILE_FILEPATH = os.path.join(BASEPATH, "..", "log.log")

with open(LOG_TEMPLATE_FILEPATH, "r") as f:
    LOG_TEMPLATE = f.read()


def get_data(): 
    req_data = requests.get(URL)

    if (req_data.status_code == 200):

        req_data = req_data.json()

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
        return
    
    print(f"Error: {req_data.status_code}")
    log_data(f"Something went wrong whilst getting data; HTTP response code: {req_data.status_code}")


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
    with open(LOG_FILE_FILEPATH, "a") as alog:
        alog.write(f"Attempting to get data, {datetime.now()}\n")

        with open(LOG_FILE_FILEPATH, "r") as rlog:
            log_count = len(re.findall("NEW LOG", rlog.read()))
            log_id = hex(log_count)

        to_log = LOG_TEMPLATE.replace("LOGID", log_id).replace("DATE", str(datetime.now()))
        to_log = to_log.replace("DATA", data)

        alog.write(to_log)
        print(f"Logged; Log ID: {log_id}; {datetime.now()}")

if __name__ == "__main__":
    main()