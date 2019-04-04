var http = require('http');
var https = require('https');
var fs = require('fs');
var genws = require('./GenericWebServices');
var iq5utils = require('./IQBot5Utils');

exports.AuthRequest = function(host,port,data,socket){
	//console.log("Received event:");
	path = '/api/authenticate';
	genws.SendGenericPostHttpRequest(host,port,path,myBody,function(res){
	//console.log("res:"+res);
	var Status = iq5utils.GetAuthStatus(res);
	if(Status){
		socket.emit('auth_response','{"success":true}');
	}else{
		socket.emit('auth_response','{"success":false}');
	}
	
	// Processing response now, need to send it back to frontned depending on status
	});
};
