#include <iostream>
#include <string>
#include <fstream>
#include <ctime>
#include <time.h>
#include <curl/curl.h>

using namespace std;

string ResponseJSON;
string LogTemplate;

void SetLogTemplate() {
    ifstream File("../logtemplate.txt");

    string Line;
    while (getline(File, Line)) {
        LogTemplate += Line + "\n";
    }

    File.close();
}

string GetJSONValue(string entireData, string keyname) {
    string value = "";

    size_t pos = entireData.find(keyname);
    if (pos != string::npos) {
        size_t pos2 = entireData.find(",", pos);
        if (pos2 != string::npos) {
            value = entireData.substr(pos + keyname.length() + 3, pos2 - pos - keyname.length() - 3);
        }
    }

    // Remove the first and last quotes
    if (value.length() > 2) {
        value = value.substr(1, value.length() - 2);
    }

    return value;
}

string GetLogID(int logCount) {
    // Convert logCount to hexadecimal string "
    string HexNumber = "";
    string Hex = "0123456789abcdef";

    while (logCount > 0) {
        HexNumber = Hex[logCount % 16] + HexNumber;
        logCount /= 16;
    }

    string LogID = "0x" + HexNumber;

    if (LogID == "0x") {
        LogID = "0x0";
    }

    return LogID;
}   

string GetDateAndTime() {
    time_t rawtime;
    struct tm * timeinfo;
    char buffer[80];

    time(&rawtime);
    timeinfo = localtime(&rawtime);

    strftime(buffer, 80, "%Y-%m-%d - %H:%M:%S", timeinfo);

    return string(buffer);
}

void LogToFile(string details) {
    string ToLog = LogTemplate;

    // Replcae "DATA" with details
    size_t pos = ToLog.find("DATA");
    if (pos != string::npos) {
        ToLog.replace(pos, 4, details);
    }

    // Replace "DATE" with date and time
    size_t DatePos = ToLog.find("DATE");
    string DateString = GetDateAndTime();

    ToLog.replace(DatePos, 4, DateString);

    // Find out how many logs were made by looking at how many times "NEW LOG" was repeated in the log file
    ifstream LogReadFile("../log.log");
    int LogCount = 0;
    string Line;
    while (getline(LogReadFile, Line)) {
        if (Line.find("NEW LOG") != string::npos) {
            LogCount++;
        }
    }    

    LogReadFile.close();

    // Replace "LOGID" with log ID
    size_t LogIDPos = ToLog.find("LOGID");
    ToLog.replace(LogIDPos, 6, GetLogID(LogCount));

    ofstream File("../log.log", ios::app);
    File << ToLog << endl;
    File.close();

    cout << "Logged; Log ID: " << GetLogID(LogCount) << "; "<<DateString << endl;
}

size_t RecieveData(char *buffer, size_t itemsize, size_t itemcount, void* stream) {
    for (int i = 0; i < itemcount; i++) {
        ResponseJSON += buffer[i];
    }

    return itemsize * itemcount;
}

int main() {
    const char URL[] = "http://ipinfo.io";

    SetLogTemplate();

    // Write to log file
    ofstream LogFile("../log.log", ios::app);
    LogFile << "Attempting to fetch data " << GetDateAndTime() << endl;

    // Initialize libcurl
    CURL *CURLHandler = curl_easy_init();
    CURLcode ResponseData;

    // Set options
    curl_easy_setopt(CURLHandler, CURLOPT_URL, URL);
    curl_easy_setopt(CURLHandler, CURLOPT_WRITEFUNCTION, RecieveData);

    // Perform request
    ResponseData = curl_easy_perform(CURLHandler);
    
    if (ResponseData != CURLE_OK) {
        cout << "Error: " << curl_easy_strerror(ResponseData) << endl;
    }

    // cout << LogTemplate;
    // cout << ResponseJSON;

    curl_easy_cleanup(CURLHandler);   

    string Details;

    string IPAddr = GetJSONValue(ResponseJSON, "ip");
    string Hostanme = GetJSONValue(ResponseJSON, "hostname");
    string City = GetJSONValue(ResponseJSON, "city");
    string Region = GetJSONValue(ResponseJSON, "region");
    string Country = GetJSONValue(ResponseJSON, "country");
    string PostalCode = GetJSONValue(ResponseJSON, "postal");
    string Location = GetJSONValue(ResponseJSON, "loc");
    string Latitude = Location.substr(0, Location.find(","));
    string Longitude = Location.substr(Location.find(",") + 1);
    string Timezone = GetJSONValue(ResponseJSON, "timezone");

    Details = "IP Address: " + IPAddr + "\n";
    Details += "Hostname: " + Hostanme + "\n";

    Details += "\n";

    Details += "Country Code: " + Country + "\n";
    Details += "City: " + City + "\n";
    Details += "Region: " + Region + "\n";
    
    Details += "\n";

    Details += "Latitude: " + Latitude + "\n";
    Details += "Longitude: " + Longitude + "\n";

    Details += "\n";

    Details += "Postal Code: " + PostalCode + "\n";
    Details += "Timezone: " + Timezone + "\n";

    LogToFile(Details);

    return 0;
}