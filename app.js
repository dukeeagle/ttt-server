var express = require('express'),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	app = express.createServer(express.logger()),
	io = require('socket.io').listen(app),
	routes = require('./routes');

//configuration

app.use(bodyParser.json());
app.use(cors());

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

app.listen(process.env.PORT || 5000);

