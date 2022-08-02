import { createServer } from "http";
import { readFileSync, appendFileSync } from "fs";
const DETAILS_URL = "https://ipinfo.io";

createServer(function (req, res) {
    request(DETAILS_URL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.writeHead(200, { "Content-Type": "text/plain" });
            
            const data = JSON.parse(body);
            
            const logFileData = readFileSync(`${__dirname}/log.log`, "utf8");
            const logTemplateData = readFileSync(`${__dirname}/logtemplate.txt`, "utf8");

            var log = logTemplateData.replace("[ip]", data.ip);
            log = log.replace("[hostname]", data.hostname);
            log = log.replace("[city]", data.city);1
            log = log.replace("[region]", data.region);
            log = log.replace("[country]", data.country);
            log = log.replace("[lat]", data.loc.split(",")[0]);
            log = log.replace("[lon]", data.loc.split(",")[1]);
            log = log.replace("[timezone]", data.timezone);
            log = log.replace("[postal]", data.postal);        

            // Find how many logs were there by seeing how many repetition of "NEW LOG" exist
            var logCount = (logFileData.match(/NEW LOG/g) || []).length;

            var logID = `0x${logCount.toString(16)}`;
            var logDate = new Date();

            log = log.replace("[date]", String(logDate));
            log = log.replace("[id]", logID)    

            // Try to log, for whatever reason it might faill, log to console
            try {
                appendFileSync(`${__dirname}/log.log`, log + "\n");
                res.end(`Log request received. Log ID: ${logID}; Log date: ${logDate}`);
            } catch (err) {
                console.log(`Couldn't log to file\n\nError: ${err}`);
                res.end(`Error: ${err}`);
            }
        }
    });
}).listen(3000);
console.log("Server running");