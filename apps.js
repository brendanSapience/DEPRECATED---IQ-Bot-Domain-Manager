var http  = require('http');
var fs    = require('fs');
var path  = require('path');
var mime  = require('mime');
var cache = {};
// send a standard error if requested static file does not exist
function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}

// serve a file, mime retrieves file type first before it is served
function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    {"content-type": mime.lookup(path.basename(filePath))}
  );
  response.end(fileContents);
}

// check if a file is in the cache before asking fs.. (more time consuming)
function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      } else {
        send404(response);
      }
    });
  }
}

var server = http.createServer(function(request, response) {
  var filePath = false;
  if (request.url == '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url;
  }
  var absPath = './' + filePath;
  serveStatic(response, cache, absPath);
});

server.listen(parseInt(process.env.UIAPPPORT), function() {
  console.log("Server listening on port "+process.env.UIAPPPORT);
});

var myServer = require('./lib/server');
// constructor of chatServer
myServer.listen(server);