# tracker

## About
This is a project made to help track your devices. It gets the device's IP address, longitude and latitude, time, date, country, city, etc.
If you lose your devices, you could use this spyware to help get it's location.
**Do note, that the location data is NOT 100% accurate, but can provide an approximate location.**

In the `server` directory, you have `server.js` which is responsible for handling the server, and the modification of the log file.
Whenever a `GET` request is sent to the server, `server.js` will get the details of that client, and will log it.
If it goes successfully, in response you'll get a response saying that the log request was recieved, and the ID of the log.

The `main.cpp` file is responseible for sending a `GET` request to the server periodically, while the `server.js` file is for handling the server, and the tramsission of the details of the client to the log file.

## Dependencies
- `request` npm package (I'll soon replace it to work with the `https` module instead, as `request` is deprecated)
- libcurl

## Progress
This project is not done yet, and there are still changes to be made.
Some changes that will happen in the future:

- Communication between the information and a web server, so that the logs can be accessed remotely
- Higher accuracy IP geolocation
- Cleaner, readable, and more performant code

## License
[tracker](https://github.com/johnmanjohnston/tracker) is licensed under [MIT License](https://opensource.org/licenses/MIT).
License information can also be found in the `LICENSE` file in the root directory of this repository.
