# tracker

## About
This is a project made to help track your devices. It gets the device's IP address, longitude and latitude, time, date, country, city, etc.
If you lose your devices, you could use this spyware to help get it's location.
**Do note, that the location data is NOT 100% accurate, but can provide an approximate location.**

## Dependencies
- `request` npm package (I'll soon replace it to work with the `https` module instead, as `request` is deprecated)
- libcurl


## Progress
This project is not done yet, and there are still changes to be made.
Some changes that will happen in the future:
- Communication between the information and a web server, so that the logs can be accessed remotely (IN PROGRESS)
- Higher accuracy IP geolocation
- Cleaner, readable, and more performant code
