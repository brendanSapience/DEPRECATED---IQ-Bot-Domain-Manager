var http  = require('http');
var https = require('https');
var fs    = require('fs');
var path  = require('path');
var mime  = require('mime');
var cache = {};


var PRIVKEYFILE = 'encryption/privkey.pem';
var CERTFILE = 'encryption/cert.pem';
var CERTCHAINFILE = 'encryption/chain.pem';

var SERVERCONFIFLE = './server_config.json';

var options = {

            };



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
    {"content-type": mime.getType(path.basename(filePath))}
  );
  response.end(fileContents);
}

// check if a file is in the cache before asking fs.. (more time consuming)
function serveStatic(response, cache, absPath) {
  //console.log("Serving File: "+absPath);
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) {
        fs.readFile(absPath, function(err, data) {
          if (err) {
            console.log("cant find file: "+absPath+" | Error:"+err);
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

function createHttpServer(){
              var server = http.createServer(function(request, response) {
              var filePath = false;
              if (request.url == '/') {
                filePath = 'index.html';
              } else {
                filePath = 'public' + request.url;
              }
              var absPath = './' + filePath;
              serveStatic(response, cache, absPath);
            });
            return server;
}
// MAIN //


var JSONCONFIGFILE = SERVERCONFIFLE;

fs.readFile(JSONCONFIGFILE,(err,data) => {
        if (err) {
          console.log("CRITICAL ERROR: Could not find Server Config File: "+err);
        }

        else{

          CONFIG = JSON.parse(data);
          //console.log("Debug:"+CONFIG['port']);
          var HttpsOrHttp = CONFIG['http_or_https'];

          if(CONFIG['http_or_https'] == "https"){
            try{
              var key = fs.readFileSync(PRIVKEYFILE);
              var cert = fs.readFileSync(CERTFILE);
              var ca = fs.readFileSync(CERTCHAINFILE);

              var options = {
                key: key,
                cert: cert,
                ca: ca
              };

              var serverS = https.createServer(options,function(request, response) {
                var filePath = false;
                //console.log("URL is:"+request.url);
                if (request.url == '/') {
                  filePath = 'index.html';
                } else {
                  filePath = 'public' + request.url;
                }
                var absPath = './' + filePath;
                serveStatic(response, cache, absPath);
              });

              serverS.listen(parseInt(CONFIG['port']), function() {
                console.log("Server listening on port "+CONFIG['port'] + " ("+HttpsOrHttp+")");
              });


              var myServer = require('./lib/server');
              myServer.listen(serverS);


            }catch (err){
              console.log("Server Error: Cert files are missing. Reverting to HTTP.")
              HttpsOrHttp = "http";
              var server = createHttpServer();
              server.listen(parseInt(CONFIG['port']), function() {
                console.log("Server listening on port "+CONFIG['port'] + " ("+HttpsOrHttp+")");
              });
              var myServer = require('./lib/server');
              myServer.listen(server);

            }
            

          }else if(CONFIG['http_or_https'] == "http"){

            var server = createHttpServer();


            server.listen(parseInt(CONFIG['port']), function() {
              console.log("Server listening on port "+CONFIG['port'] + " ("+HttpsOrHttp+")");
            });


            var myServer = require('./lib/server');
            myServer.listen(server);
          }else{
            console.log("CRITICAL ERROR: Could not determine http_or_https configuration.")
          }


        }
});



