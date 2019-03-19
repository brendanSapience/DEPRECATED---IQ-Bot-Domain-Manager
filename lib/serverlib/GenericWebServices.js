var http = require('http');
var https = require('https');
var fs = require('fs');


// area = plex, version = v1, action=refreshall, parameters = '{"param1":"value1","param2":"value2"}'
// RESParameters are potential value to send to the callback as a parameter. 
// example: RESParameters = '{"taskid":12434573495}' => callback signature becomes (12434573495,str) instead of just (str). leave as '{}' for default behavior.
exports.SendGenericPostHttpRequest = function(host,port,version,body,myCall){
	// setting standard options for https request
	var options = {
		host: host,  
		rejectUnauthorized: false, 
		port: port,
		method: 'POST',
		json: body,
		path: '/api/authenticate',
		headers: { 'Content-Type': 'application/json' }
	};

	// callback function for https request
	callback = function(response) {
	  var str = '';
	  response.on('data', function (chunk) {
	    str += chunk;
	  });
	  response.on('end', function () {
		//if(DebugMode==true){console.log("Output Caught: "+ str)};
		//if(DebugMode==true){console.log("Output Type: "+ typeof str)};

		myCall(str);
		

		});
	  };

	var myReq = http.request(options, callback);

	myReq.on('error', function(err){
		myCall(err);
		//console.log("WARNING: " + "Time Out occured with backend server when requesting service for " + area);
	});
	myReq.end();
};


