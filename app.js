//dependencies
 var express = require('express');
 var cors = require('cors');
 var bodyParser = require('body-parser');
 var http = require('http');
 
 var app = express();
 var server = require('http').createServer(app);
 var io = require('socket.io').listen(server);

 app.use(bodyParser.json());
 app.use(cors());
 
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

 app.listen(process.env.PORT || 4730); //if port doesn't work, use port 4730


//express = require('express'),

	//app = module.exports.app = express();

//var server = http.createServer(app);
//  //pass a http.Server instance
	//server.listen(80);  //listen on port 80
//routes = require('./routes'),
//server.listen(4730);
//var http = require('http');