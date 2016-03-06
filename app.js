//dependencies
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(cors());

var messages = []; //make an array to hold messages
var rooms = [];
var users = [];


/*app.get('/users', function(req, res)) {
	res.json(user);
};

app.get('/users/:id/')
*/

app.get('/rooms', function(req, res) {
	res.json(rooms);
});

app.get('/rooms/:id/', function(req, res){
	var room = rooms[req.params.id];
	res.json(room);
});

app.post('/rooms', function(req, res) {
	var newRoom = {
		timestamp: new Date(),
		username: req.body.username
	};
	rooms.push(newRoom);
	res.json(rooms);
	console.log(rooms);
});



app.get('/messages', function(req, res) {  //req = request, res = response
	res.json(messages);
});

app.get('/messages/:id', function(req,res) {
	var message = messages[req.params.id];
	res.json(message);
});

app.post(req.params.id + '/messages', function(req,res){
	var newMessage = {
		message:req.body.message,
		username:req.body.username,
		timestamp: new Date()
	};

	messages.push(newMessage);
	res.json(messages);
});



app.listen(process.env.PORT || 4730); //if port doesn't work, use port 4730
