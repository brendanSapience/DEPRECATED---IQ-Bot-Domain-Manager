var socketio = require('socket.io');
var genutils = require('./GenericUtils');
var io;
const fs = require('fs');

var homelisteners = require('./serverlib/SQLIQBotRequests.js');

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


}


exports.listen = function(server) {
	io = socketio.listen(server);
	//io.set('log level', 1);
	io.sockets.on('connection', function (socket) {
		processRequest(socket);
	});
};
