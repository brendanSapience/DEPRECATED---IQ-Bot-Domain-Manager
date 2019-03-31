var http = require('http');
var https = require('https');
var fs = require('fs');
var genws = require('./GenericWebServices');
var iq6utils = require('./IQBot6Utils');

exports.AuthRequest = function(host,port,data,socket){
	console.log("Received event:");
	path = '/v1/authentication';
	genws.SendGenericPostHttpRequest(host,port,path,myBody,function(res){
	console.log("res:"+res);
	var Status = iq6utils.GetAuthStatus(res);
	if(Status){
		socket.emit('auth_response','{"success":true}');
	}else{
		socket.emit('auth_response','{"success":false}');
	}
	
	// Processing response now, need to send it back to frontned depending on status
	});
};