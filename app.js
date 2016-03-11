//dependencies 	
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(cors());
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
	socket.emit('hello!');
	console.log('connection');
});


var users = [];

var rooms = []; //make an array to hold rooms

app.get('/rooms', function(req, res) {  //req = request, res = response
	var user = users[req.params.id];
	var userRooms=[];
	//for(room in rooms){  [try and fix this stuff]
		//if(new UserIsClose(room.lat, user.lat, room.lon, user.lon)){
			//userRooms.push(room);
			//console.log("This room is close enough" + room);
		//}
	//}
	res.json(rooms);
	//res.json(userRooms);
});

app.get('/rooms/:id', function(req,res) {
	var room = rooms[req.params.id];
	res.json(room);
});

app.post('/rooms', function(req,res){
	var newRoom = {
		name:req.body.name,
		id:rooms.length, 
		username:req.body.username,
		timestamp: new Date(), 
		messages: [],
		players: []
	};
	rooms.push(newRoom);
	res.json(rooms);
});

app.post('/rooms/:id/messages', function(req, res){
	var room = rooms[req.params.id];
	var newMessage = {
		username:req.body.username,
		timestamp: new Date(),
		message: req.body.message
	}
	room.messages.push(newMessage);
	res.json(room);
});

app.post('/rooms/:id/players', function(req, res){
	var room = rooms[req.params.id];
	var newPlayer = {
		timestamp: new Date(),
		username: req.body.username
	};
	
	room.players.push(newPlayer);
	res.json(room);

});

app.post('/users', function(req, res){
	var newUser = {
		username: req.body.username,
		id: users.length
	}
	users.push(newUser);
	res.json(newUser) ;
});

io.on('player enter', function(newPlayer){
	socket.emit('new player', newPlayer);
});

app.listen(process.env.PORT || 4730); //if port doesn't work, use port 4730