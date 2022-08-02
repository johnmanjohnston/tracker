#include <iostream>
#include <string>
#include <chrono>
#include <thread>
#include <curl/curl.h>
#include <signal.h>
#include <stdlib.h>

std::string ResponseString;
int sessionLogCount;
const char URL[] = "http://localhost:3000"; // If you're using your own server, change this variable

// Exit handler logic   
void ExitHandler(int sig) {
    curl_global_cleanup();
    std::string strSessionLogCount = std::to_string(sessionLogCount);
    std::cout << "\nStopping logging, and exiting; " + strSessionLogCount + " log(s) written in this session" << std::endl;
    exit(0);
}

// We need this chunk of code to store the response in a string
size_t RecieveData(void *ptr, size_t size, size_t nmemb, void *stream) {
    size_t datasize = size * nmemb;
    ResponseString.append((char*)ptr, datasize);

    return datasize;
}

// Sleep functions
void SleepethForSecs(uint sec) {
    std::this_thread::sleep_for(std::chrono::seconds(sec));
}

void SleepethForMins(uint mins) {
    std::this_thread::sleep_for(std::chrono::minutes(mins));
}

void SleepethForHours(uint hours) {
    std::this_thread::sleep_for(std::chrono::hours(hours));
}

void GetAndLog() {
    // Exit handler
    signal(SIGINT, ExitHandler);

    CURL *Handler;

    std::cout << "Sending request to log...\n";
    CURLcode Response;
    Handler = curl_easy_init();

    curl_easy_setopt(Handler, CURLOPT_URL, URL);
    curl_easy_setopt(Handler, CURLOPT_WRITEFUNCTION, RecieveData);

    Response = curl_easy_perform(Handler);

    if (Response == CURLE_OK) {
        sessionLogCount++;
    } else {
        std::cout << "Error: " << Response << std::endl;
    }

    std::cout << ResponseString + "\n\n";
    curl_easy_cleanup(Handler);

    // ResponseString is a global variable, it doesn't reset on its own after we get the response
    // so we manually reset it here
    ResponseString = "";
    SleepethForSecs(5);
    GetAndLog();
}

int main() {
    std::cout << "Starting logging...";
    GetAndLog();

    return 0;
}