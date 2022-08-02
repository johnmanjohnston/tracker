const http = require("http");
const request = require("request");
const fs = require("fs");

const PORT = 3000;
const DETAILS_URL = "https://ipinfo.io";

http.createServer(function (req, res) {
    request(DETAILS_URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.writeHead(200, { "Content-Type": "application/json" });
            
            const data = JSON.parse(body);
            
            const logfile = `${__dirname}/log.log`;
            const logtemplate = fs.readFileSync(`${__dirname}/logtemplate.txt`, "utf8");

            var log; 
            log = logtemplate.replace("[ip]", data.ip);
            log = log.replace("[hostname]", data.hostname);
            log = log.replace("[city]", data.city);1
            log = log.replace("[region]", data.region);
            log = log.replace("[country]", data.country);
            log = log.replace("[lat]", data.loc.split(",")[0]);
            log = log.replace("[lon]", data.loc.split(",")[1]);
            log = log.replace("[timezone]", data.timezone);
            log = log.replace("[postal]", data.postal);        

            var logCount = 0;

            fs.readFileSync(logfile, "utf8").split("\n").forEach((line) => {
                if (line.includes("NEW LOG")) logCount++;
            });

            var logID = `0x${logCount.toString(16)}`;
            var logDate = new Date();

            log = log.replace("[date]", String(logDate));
            log = log.replace("[id]", logID)    

            fs.appendFile(logfile, log + "\n", (err) => {
                if (err) {
                    res.end(`Something went wrong while logging Log ${logID}`);
                }
                console.log(`Log ${logID} written to ${logfile}`);
                res.end(`Log request recieved; Log ID: ${logID}; Log date: ${logDate}`);
            });
        }
    });
}).listen(PORT);

console.log(`Server running on http://localhost:${PORT}`);