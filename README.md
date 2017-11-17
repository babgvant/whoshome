Name Who's Home
Description: Node.js app that checks a Unifi Controller for specific MAC addresses, or device names to tell who is home

Usage: node ./bin/www

## Install

git clone 

cd whoshome

npm install

## Config

Settings are configured in settings.json

{
  "port": 3001, //port to listen on
  "unifiserver": "192.168.1.18", //unifi controller hostname or IP
  "unifiport": "8443", //unifi controller port
  "unifiusername": "", //unifi controller user name
  "unifipassword" : "", //unif controller password
  "usemacs" : true, //use MAC addresses in scanmacs when true, otherwise use device name (alias) in scannames
  "scanmacs" : ["", ""], //array of strings containing MAC addresses to match in xx:xx:xx:xx:xx:xx format. 
  "scannames" : ["", ""] //array of strings containing device name (alias) to match.
}

## Windows Service Install

1) Install node-windows: https://github.com/coreybutler/node-windows
2) Edit service.js to specify the path to www file
3) Run node service.js from an elevated command prompt
4) Configure firewall rule to allow port noted in settings.json

## Usage

http://localhost:3001/home

Returns JSON object with clients found, allHome (bool), expected (int, length of scanmacs or scannames), current (int, length of clients)

Optional parameters are also supported in the GET request (noted by index) http://localhost:3001/home/0/1/2

0: Index in unifi sites array to use, in many cases this will be 0 unless multiple sites are hosted on one controller (e.g. http://localhost:3001/home/0).
1: Either "json" or "simple", default is "json". When "simple" used only the value of allHome is returned. Use for clients that do not support JSON parsing (e.g. http://localhost:3001/home/0/simple)
2: MAC address or device name (usemacs settings respected) to look for a single client. Returns data based only on specific MAC or name passed on URL (e.g. http://localhost:3001/home/0/simple/xx:xx:xx:xx:xx:xx)

