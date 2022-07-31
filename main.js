const http = require("http");
const fs = require("fs");
const ipURL = "http://ipinfo.io/";

function log(tolog) {
    fs.appendFile("./log.log", tolog + "\n", (err) => {
        if (err) {
            console.log(err);
        }
    });
}

const LOGTEMPLATE = `==========================================================
New Log, ${new Date()}

DATA

==========================================================

`

http.get(ipURL, (response) => {
    response.on("data", (data) => {
        const requestData = JSON.parse(data);

        const details = 
`IP: ${requestData.ip}
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
