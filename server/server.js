const http = require("http");
const request = require("request");
const fs = require("fs");
const DETAILS_URL = "https://ipinfo.io";

http.createServer(function (req, res) {
    if (req.url === "/logs" || req.url === "/logs/") {
        fs.readFile(`${__dirname}/log.log`, (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end(err.message);
            } else {
                res.writeHead(200, { "Content-Type": "text/plain" });

                if (String(data) === "") {
                    res.end("The log file is empty.");
                    return;
                }

                res.end(data);
            }
        });
    } else if (req.url === "/"){
        request(DETAILS_URL, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.writeHead(200, { "Content-Type": "text/plain" });
                
                const data = JSON.parse(body);
                
                const logFileData = fs.readFileSync(`${__dirname}/log.log`, "utf8");
                const logTemplateData = fs.readFileSync(`${__dirname}/logtemplate.txt`, "utf8");

  /* jäl */ var log = logTemplateData.replace("[ip]", data.ip);
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

                fs.appendFileSync(`${__dirname}/log.log`, log + "\n");
                res.end(`Log request received. Log ID: ${logID}; Log date: ${logDate}`);
            }
        });
    } else {
        res.write("404: Page not found");
        res.end();
    }

}).listen(8080);
console.log("Server running");