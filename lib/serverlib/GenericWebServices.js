var http = require('http');
var https = require('https');
var fs = require('fs');


// area = plex, version = v1, action=refreshall, parameters = '{"param1":"value1","param2":"value2"}'
// RESParameters are potential value to send to the callback as a parameter. 
// example: RESParameters = '{"taskid":12434573495}' => callback signature becomes (12434573495,str) instead of just (str). leave as '{}' for default behavior.
exports.SendGenericPostHttpRequest = function(host,port,myPath,data,myCall){
	// setting standard options for https request
	var options = {
		host: host,  
		rejectUnauthorized: false, 
		port: port,
		method: 'POST',
		json: data,
		path: myPath,
		headers: { 
			'Content-Type': 'application/json',
			'Content-Length': data.length
			 }
	};

	// callback function for https request
	callback = function(response) {
	  var str = '';
	  response.on('data', function (chunk) {
	    str += chunk;
	  });
	  response.on('end', function () {
		myCall(str);
		});
	  };


	var myReq = http.request(options, callback);

	myReq.on('error', function(err){
		myCall(err);
	});
	myReq.write(data)

	myReq.end();
};


