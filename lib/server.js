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
// Start
var SERVEROK = true;
var SERVERTIMEOUT = false;


function processRequest(socket) {

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

	// when getting a structure save request from the UI, save the JSON passed as the new config file
	socket.on('save_structure', function(data){
		//console.log(data)
		var json = JSON.stringify(data);
		fs.writeFile(JSONCONFIGFILE, json, 'utf8', (err) => {
			if (err) 
				socket.emit('server_side_error',err);
		});
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
