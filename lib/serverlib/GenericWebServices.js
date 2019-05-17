var http = require('http');
var https = require('https');
var fs = require('fs');



// area = plex, version = v1, action=refreshall, parameters = '{"param1":"value1","param2":"value2"}'
// RESParameters are potential value to send to the callback as a parameter. 
// example: RESParameters = '{"taskid":12434573495}' => callback signature becomes (12434573495,str) instead of just (str). leave as '{}' for default behavior.
exports.SendGenericPostHttpRequest = function(host,port,myPath,data,myCall){
	// setting standard options for https request
	//console.log("DEBUG:"+data.length);
	var options = {
		host: host,  
		rejectUnauthorized: false, 
		port: port,
		method: 'POST',
		json: data,
		path: myPath,
		timeout:6000,
		headers: { 
			'Content-Type': 'application/json'
			 }
	};

	//console.log("Debug Options:"+ JSON.stringify(options));
	// callback function for https request
	callback = function(response) {
	  var str = '';
	  response.on('data', function (chunk) {
	    str += chunk;
	  });
	  response.on('end', function () {
	  	//console.log("Debug Internal Resp:"+ JSON.stringify(str));
	  	try {
        	myCall(str);
    	} catch (e) {
    		//console.log("CATCH!");
        	myCall('{"message":"invalid server response"}');
    	}
    	return true;

		
		});
	  response.on('error', function(err){
	  	socket.emit("server_side_error",err);

	  })
	  };


	var myReq = http.request(options, callback);

	myReq.on('error', function(err){
		//console.log("Debug Internal Resp:"+ JSON.stringify(err));
		myCall('{"message":"'+err+'"}');
		socket.emit("server_side_error",err);
	});

	myReq.on('timeout', () => {
    	//myReq.abort();
    	myCall('{"message":"connection timeout"}');

	});

	myReq.write(data);

	myReq.end();
};

exports.SendGenericPostHttpRequestWithToken = function(host,port,myPath,data,token,myCall){
	// setting standard options for https request
	//console.log("DEBUG PAYLOAD: "+JSON.stringify(data));

	var options = {
		host: host,  
		rejectUnauthorized: false, 
		port: port,
		method: 'POST',
		json: data,
		path: myPath,
		timeout:20000,
		headers: { 
			'Content-Type': 'application/json',
			'x-authorization': token
			 }
	};

	//console.log("Debug OPTIONS:"+JSON.stringify(options));
	// callback function for https request
	callback = function(response) {
	  var str = '';
	  response.on('data', function (chunk) {
	    str += chunk;
	  });
	  response.on('end', function () {
		myCall(str);
		myReq.end();
		});
	  };


	var myReq = http.request(options, callback);

	myReq.on('error', function(err){
		myCall(err);
		socket.emit("server_side_error",err);
	});

	myReq.on('timeout', () => {
    	//myReq.abort();
    	myCall('{"success":false,"data":"","errors":"timeout"}');
	});

	myReq.write(JSON.stringify(data));

	myReq.end();
};


