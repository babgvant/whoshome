var express = require('express');
var router = express.Router();
var unifi = require('node-unifi');
var sett = require("../settings.json");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/home/:site?/:outtype?/:mac?', function(req, res, next) {
	var siteindex = req.params.site;
    if (!siteindex) {
        siteindex = 0;
    }
	var outtype = req.params.outtype;
    if (!outtype) {
        outtype = 'json';
    }
	var mac = req.params.mac;
    	
	var controller = new unifi.Controller(sett.unifiserver, sett.unifiport);
	controller.login(sett.unifiusername, sett.unifipassword, function(err) {
		if(err) {
			res.status(500).send('ERROR: ' + err)
			console.log('ERROR: ' + err);
		} else {
			// GET SITE STATS 
			controller.getSitesStats(function(err, sites) {
				//console.log('getSitesStats: ' + sites[siteindex].name + ' : ' + sites.length);
				//console.log(JSON.stringify(sites));
				if(err) {
					res.status(500).send('ERROR: ' + err)
					console.log('ERROR: ' + err);
				} else {
					// GET CLIENT DEVICES 
					controller.getClientDevices(sites[siteindex].name, function(err, client_data) {
						var homeResp = {};
						if(err) {
							res.status(500).send('ERROR: ' + err)
							console.log('ERROR: ' + err);
						} else {
							//console.log('getClientDevices: ' + client_data[0].length);
							//console.log(JSON.stringify(client_data));
							if(sett.usemacs){
								if (!mac) {
									homeResp.clients = client_data[0].filter(client => (sett.scanmacs.includes(client.mac)));
									homeResp.allHome = (homeResp.clients.length == sett.scanmacs.length);
									homeResp.expected = sett.scanmacs.length;
									homeResp.current = homeResp.clients.length;
								} else {
									homeResp.clients = client_data[0].filter(client => (mac == client.mac));			homeResp.allHome = (homeResp.clients.length == 1);
									homeResp.expected = 1;
									homeResp.current = homeResp.clients.length;
								}															
							} else {
								if (!mac) {
									homeResp.clients = client_data[0].filter(client => (sett.scannames.includes(client.name)));
									homeResp.allHome = (homeResp.clients.length == sett.scannames.length);
									homeResp.expected = sett.scannames.length;
									homeResp.current = homeResp.clients.length;
								} else {
									homeResp.clients = client_data[0].filter(client => (mac == client.name));			homeResp.allHome = (homeResp.clients.length == 1);
									homeResp.expected = 1;
									homeResp.current = homeResp.clients.length;
								}	
							}
							//console.log('clientsHome found: ' + homeResp.clients.length);
							
							switch(outtype){
								case "json":
									res.json(homeResp);
									break;
								default:
									res.json(homeResp.allHome);
									break;
							}
						}
						
						// FINALIZE, LOGOUT AND FINISH 
						controller.logout();
					});
				}
			});
		}
	});
});

module.exports = router;
