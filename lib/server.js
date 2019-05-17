var socketio = require('socket.io');
var genutils = require('./GenericUtils');
var io;
const fs = require('fs');
var genws = require('./serverlib/GenericWebServices');
var iq5req = require('./serverlib/IQBot5Requests');
var iq6req = require('./serverlib/IQBot6Requests');

//var homelisteners = require('./serverlib/SQLIQBotRequests.js');

var DebugMode = false;

var JSONCONFIGFILE = './lib/config.json'
var JSONAPPCONFIGFILE = './lib/app_config.json'
var LANGUAGEFILE = './lib/languages.json'

// Start
var SERVEROK = true;
var SERVERTIMEOUT = false;


function processRequest(socket) {

	socket.on('get_languages', function(){

			fs.readFile(LANGUAGEFILE,(err,data) => {
				if (err) {
					//console.log("error reading file config.json"+err);
					socket.emit('server_side_error',err);
					
				}

				else{
					socket.emit('languages_sent',JSON.parse(data));
				}

			});

	});

	// when getting a structure request from UI, send the JSONified content of the config file
	socket.on('get_structure', function(){
		// plex.GetCurrentSessionsInfo(cookies[0],cookies[1],function(result){    
			//console.log("Getting Structures");
			fs.readFile(JSONCONFIGFILE,(err,data) => {
				if (err) {
					//console.log("error reading file config.json"+err);
					socket.emit('server_side_error',err);
					
				}

				else{
					socket.emit('structure_sent',JSON.parse(data));
				}

			});

	});

		socket.on('get_mode', function(){
		// plex.GetCurrentSessionsInfo(cookies[0],cookies[1],function(result){    
			//console.log("Getting Structures");
			fs.readFile(JSONAPPCONFIGFILE,(err,configdata) => {
				if (err) {
					//console.log("error reading file config.json"+err);
					socket.emit('demo_mode',false);
				}

				else{
					myConfigData = JSON.parse(configdata);
					DemoMode = myConfigData['demo_mode'];

					socket.emit('demo_mode',DemoMode);
				}

			});

	});


	// when getting a structure save request from the UI, save the JSON passed as the new config file
	socket.on('save_structure', function(data){
		//console.log(data)
		var json = JSON.stringify(data);
		fs.writeFile(JSONCONFIGFILE, json, 'utf8', (err) => {
			if (err) 
				socket.emit('server_side_error',err);
		});
	});

	socket.on('import_json_domain', function(domaindata){
		//console.log("sdfgxsf")
		fs.readFile(JSONCONFIGFILE,(err,configdata) => {
			if (err) {
				//console.log("error reading file config.json"+err);
				socket.emit('server_side_error',err);
			}

			else{
				myConfigData = JSON.parse(configdata);
				login = myConfigData['login'];
				pwd = myConfigData['password'];
				url = myConfigData['url'];
				version = myConfigData['major_version'].trim();

				myBody = '{"username":"'+login+'","password":"'+pwd+'"}'

				myAuthPort = genutils.GetPortFromURL(url);
				myAuthURL = genutils.GetRootFromURL(url);
				//console.log("DEBUG: data: "+JSON.stringify(myConfigData));
				//console.log("DEBUG: port: "+myAuthPort);

				if(version == "6"){

					iq6req.ImportDomainRequest(myAuthURL,myAuthPort,8100,myBody,domaindata,socket);

					
				}
				

			}

			});
	});

	socket.on('save_and_test_iqbot_connection', function(res){

		var json = JSON.stringify(res);
		fs.writeFile(JSONCONFIGFILE, json, 'utf8', (err) => {
			if (err) 
				socket.emit('server_side_error',err);
		});

		//myData = JSON.parse(res);
		login = res['login'];
		pwd = res['password'];
		url = res['url'];
		version = res['major_version'].trim();

		myBody = '{"username":"'+login+'","password":"'+pwd+'"}'
		//console.log("debug:"+myBody);
		if(version == "5"){
			iq5req.AuthRequest(genutils.GetRootFromURL(url),genutils.GetPortFromURL(url),myBody,socket);
		}else if(version == "6"){
			iq6req.AuthRequest(genutils.GetRootFromURL(url),genutils.GetPortFromURL(url),myBody,socket);
		}else{
					// Invalid IQ Bot version
		}
	});
	

	socket.on('test_iqbot_connection', function(){
		//console.log("sdfgxsf")
		fs.readFile(JSONCONFIGFILE,(err,data) => {
			if (err) {
				//console.log("error reading file config.json"+err);
				socket.emit('server_side_error',err);
			}

			else{
				myData = JSON.parse(data);
				login = myData['login'];
				pwd = myData['password'];
				url = myData['url'];
				version = myData['major_version'].trim();

				myBody = '{"username":"'+login+'","password":"'+pwd+'"}'
				//console.log("debug:"+myBody);
				if(version == "5"){
					iq5req.AuthRequest(genutils.GetRootFromURL(url),genutils.GetPortFromURL(url),myBody,socket);
				}else if(version == "6"){
					iq6req.AuthRequest(genutils.GetRootFromURL(url),genutils.GetPortFromURL(url),myBody,socket);
				}else{
					// Invalid IQ Bot version
				}
				

			}

			});
	});

}


exports.listen = function(server) {
	io = socketio.listen(server);
	//io.set('log level', 1);
	io.sockets.on('connection', function (socket) {
		processRequest(socket);
	});
};
