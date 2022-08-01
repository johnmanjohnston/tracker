const http = require("http");
const fs = require("fs");
const URL = "http://ipinfo.io/";

const LOGTEMPLATE_FILEPATH = `${__dirname}/../logtemplate.txt`;
const LOG_FILEPATH = `${__dirname}/../log.log`;

const LOGTEMPLATE = fs.readFileSync(LOGTEMPLATE_FILEPATH, "utf8");

function log(data) {
    const logID = "0x" + (fs.readFileSync(LOG_FILEPATH, "utf8").split("NEW LOG").length - 1).toString(16);

    data = data.replace("DATE", new Date().toString()).replace("LOGID", logID);

    fs.appendFile(LOG_FILEPATH, data + "\n", (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });

    console.log(`Logged; Log ID: ${logID}; ${new Date()}`);
}


function getDataAndLog() {
    fs.appendFile(LOG_FILEPATH, `Attempting to get data, ${new Date()}` + "\n", (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });

    http.get(URL, (res) => {
        res.on("data", (data) => {
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

setInterval(getDataAndLog, minToMs(0.07));

process.stdin.resume();
process.on("SIGINT", function () {
    console.log("\nStopping logging...");
    process.exit(0);
});