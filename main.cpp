#include <iostream>
#include <curl/curl.h>
#include <string>

std::string ResponseString;

size_t RecieveData(void *ptr, size_t size, size_t nmemb, void *stream) {
    size_t datasize = size * nmemb;
    ResponseString.append((char*)ptr, datasize);
    return datasize;
}

void GetAndLog() {
    char URL[] = "http://localhost:3000";
    CURL *Handler;

    std::cout << "Sending request to log...\n";
    CURLcode Response;
    Handler = curl_easy_init();

    curl_easy_setopt(Handler, CURLOPT_URL, URL);
    curl_easy_setopt(Handler, CURLOPT_WRITEFUNCTION, RecieveData);


    Response = curl_easy_perform(Handler);

    std::cout << ResponseString + "\n";
    curl_easy_cleanup(Handler);
}

int main() {
    GetAndLog();
    return 0;
}