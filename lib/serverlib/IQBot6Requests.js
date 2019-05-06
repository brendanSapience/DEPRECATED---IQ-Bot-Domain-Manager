var http = require('http');
var https = require('https');
var fs = require('fs');
var genws = require('./GenericWebServices');
var iq6utils = require('./IQBot6Utils');

exports.AuthRequest = function(host,port,data,socket){
	//console.log("Received event:");
	path = '/v1/authentication';
	genws.SendGenericPostHttpRequest(host,port,path,myBody,function(res){
	//console.log("DEBUG Response:"+res);

	var jsonr = JSON.parse(res);

	var Status = iq6utils.GetAuthStatus(res);
	if(Status){
		socket.emit('auth_response','{"success":true,"message":"OK"}');
	}else{
		socket.emit('auth_response','{"success":false,"message":"'+jsonr['message']+'"}');
	}
	
	// Processing response now, need to send it back to frontned depending on status
	});
};

exports.AuthTokenRequest = function(host,port,data,socket){
	//console.log("Received event:");
	path = '/v1/authentication';
	//console.log("DEBUG 2 data:"+JSON.stringify(data));
	genws.SendGenericPostHttpRequest(host,port,path,data,function(res){
		//console.log("DEBUG RETURNED: " + res );
		var token = iq6utils.GetAuthToken(res);

		if(token != ""){

			socket.emit('auth_response','{"success":true}');
			// If Token is OK, then let's import the domain..
			return token;

		}else{
			socket.emit('auth_response','{"success":false}');
			return "";
		}
		
		// Processing response now, need to send it back to frontned depending on status
	});
	//return token;
};



exports.ImportDomainRequest = function(host,authport,aliasport,authdata,domaindata,socket){
	//console.log("Received event:");
	authpath = '/v1/authentication';
	domainimportpath = '/domains/import';
	genws.SendGenericPostHttpRequest(host,authport,authpath,authdata,function(AuthRes){
		
		var token = iq6utils.GetAuthToken(AuthRes);
		//console.log("DEBUG TOKEN:"+token);
		genws.SendGenericPostHttpRequestWithToken(host,aliasport,domainimportpath,domaindata,token,function(DomainImportRes){
			//console.log(DomainImportRes);
			socket.emit('domain_create_response',DomainImportRes);

		});

	});

};