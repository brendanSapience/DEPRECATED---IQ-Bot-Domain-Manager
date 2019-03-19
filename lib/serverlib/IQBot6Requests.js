var http = require('http');
var https = require('https');
var fs = require('fs');
var genws = require('./GenericWebServices');

exports.AuthRequest = function(host,port,path,data,myCall){

	path = '/??';// TODO
	genws.SendGenericPostHttpRequest(host,port,path,myBody,function(res){
	console.log("res:"+res);
	// Processing response now, need to send it back to frontned depending on status
	});
};
