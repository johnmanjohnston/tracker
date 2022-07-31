const http = require("http");
const fs = require("fs");
const URL = "http://ipinfo.io/";

function log(data) {
    const logCount = fs.readFileSync("./log.log", "utf8").split("NEW LOG").length - 1;
    const logID = "0x" + ((parseInt(logCount).toString(16)));

    data = data.replace("DATE", new Date().toString())
    data = data.replace("LOGID", logID);

    fs.appendFile("./log.log", data + "\n", (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });

    console.log(`Logged; Log ID: ${logID}; ${new Date()}`);
}

const LOGTEMPLATE = fs.readFileSync("./logtemplate.txt", "utf8");

function getDataAndLog() {
    fs.appendFile("./log.log", `Attempting to get data, ${new Date()}` + "\n", (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });


    http.get(URL, (response) => {
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