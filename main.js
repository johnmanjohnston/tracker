const http = require("http");
const fs = require("fs");
const ipURL = "http://ipinfo.io/";

function log(tolog) {
    tolog = tolog.replace("DATE", new Date().toString())

    // Get the count of how many logs have been made, by counting how many "NEW LOG" strings are in the log file
    const logCount = fs.readFileSync("./log.log", "utf8").split("NEW LOG").length - 1;
    const hexLogCount = parseInt(logCount).toString(16);

    tolog = tolog.replace("LOGID", "0x" + (hexLogCount.toUpperCase()));

    fs.appendFile("./log.log", tolog + "\n", (err) => {
        if (err) {
            console.log(err);
        }
    });
}

const LOGTEMPLATE =
`
                        _________
                        |NEW LOG|
=========================================================
Date: DATE
Log ID: LOGID

DATA

(Log data from http://ipinfo.io)
(NOTE: This data is not guaranteed to be accurate)
=========================================================

`

function getDataAndLog() {
    log(`Attempting to get data, ${new Date()}`)

    http.get(ipURL, (response) => {
        response.on("data", (data) => {
            const requestData = JSON.parse(data);
            const details = 
`
IP: ${requestData.ip}
Hostname: ${requestData.hostname}

Country Code: ${requestData.country}
City: ${requestData.city}
Region: ${requestData.region}

Latitude: ${requestData.loc.split(",")[0]}
Longitude: ${requestData.loc.split(",")[1]}

Postal Code: ${requestData.postal}
Timezone: ${requestData.timezone}`;

            log(LOGTEMPLATE.replace("DATA", details));

            console.log(requestData);
        });

        }).on("error", (error) => {
            log(LOGTEMPLATE.replace("DATA", `Error, couldn't log\nError Data: ${error.message}`));
            console.log(error);
        }
    );
}

// getDataAndLog();

function minToMs(min) {
    return min * 60 * 1000;
}

setInterval(getDataAndLog, minToMs(0.1));