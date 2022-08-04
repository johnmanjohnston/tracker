# tracker

## About
This is a project made to track your devices. It gets the device's IP address, and other location details.
The information is gained by sending a HTTP request to [`https://ipinfo.io`](https://ipinfo.io).
**Do note, that the location data is NOT 100% accurate, but can provide an approximate location.**

In the `server` directory, you have `server.js` which is responsible for handling the server, and the modification of the log file.
Whenever a `GET` request is sent to the server, `server.js` will get the details of that client, and will log it.
If it goes successfully, in response you'll get a response saying that the log request was recieved, and the ID of the log.

The `main.cpp` file is responseible for sending a `GET` request to the server periodically, while the `server.js` file is for handling the server, and the tramsission of the details of the client to the log file.

## Dependencies
- [`request`](https://www.npmjs.com/package/request) npm package
- [libcurl](https://curl.se/libcurl/)

# Use Instructions
To use this to actually keep logging and keep track of your device's IP and location, you'll need your own web server. You'll have to make sure that the `server.js` file is in charge of the server, and you'll have to update the `URL[]` variable in `main.cpp` to the URL of your web server. Then, on the device you want to send the log requests, compile `main.cpp`, and run the output file.

## License
[tracker](https://github.com/johnmanjohnston/tracker) is licensed under [MIT License](https://opensource.org/licenses/MIT).
License information can also be found in the `LICENSE` file in the root directory of this repository.
