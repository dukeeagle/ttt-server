//dependencies 	
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(cors());
var uuid = require('node-uuid');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
//var io = socket.listen(server);
var corser = require('corser');
var _ = require('lodash');

var usernames = [];
var socketRooms = [];
io.sockets.on('connection', function(socket){
	socket.emit('hello!');
	console.log('connection');
	socket.on('addUser', function(username, room){
		/*var client = {
			socket: socket.id
		};*/
		socket.username = username;
		socket.username = socket.id;
		usernames.push(username);
		usernames[username] = username;
		io.sockets.emit('updateUser', usernames);
		io.sockets.emit('updateRooms', socketRooms);
	});
	socket.on('gameStart', function(room){
		var playerCount = room.players.length;
		var traitorIndex = Math.floor((Math.random() * playerCount) + 0);
		io.to(socket.username).emit('innocent', "Prepare thyself...");
		/*for(var i = room.players.length - 1; i >= 0; i--){
			if(i === traitorIndex){
				for(var x = usernames.length - 1; x >= 0; x--){
					if(_.isEqual(room.players[traitorIndex].username, usernames[x].username)){
						
						socket.broadcast.to(usernames[x].username).emit('traitor', "But you were the chosen one!");
					} 
				}
			}
			for(var y = usernames.length -1; x >= 0; x--){
				if(_.isEqual(room.players[i].username, usernames[y].username)){
					socket.broadcast.to(usernames[y].username).emit('innocent', "You best be cathing them terries");
				}
			}
		}*/
	});
	/*socket.on('createRoom', function(newRoom){
		socketRooms.push(newRoom);
		socketRooms[newRoom] = newRoom;
		io.sockets.emit('updateRoomsTest', newRoom);
		io.sockets.emit('updateRooms', socketRooms);
	});*/
	socket.on('enterRoom', function(thisRoom){
		//socketRooms[thisRoom] = thisRoom;
		//socket.room = thisRoom;
		socket.join(thisRoom);
		io.sockets.emit('updateRoom', socket.room);
	});
	socket.on('leaveRoom', function(leftRoom){
		socket.leave(leftRoom);
		io.sockets.emit('updateRoom', socket.username + 'has left the room');
	});
	/*socket.on('disconnect', function(){
		delete usernames[socket.username];
		socket.leave(socket.room);
	});*/
})
;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", 'POST,GET,DELETE,PUT,OPTIONS');
  next();
});


// Configure CORS (Cross-Origin Resource Sharing) Headers 
app.use(corser.create({
    methods: corser.simpleMethods.concat(["PUT"]),
    requestHeaders: corser.simpleRequestHeaders.concat(["X-Requested-With"])
}));
app.all('*', function(request, response, next) {
    response.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Authorization,Access-Control-Allow-Origin');
    response.header('Access-Control-Allow-Methods', 'POST,GET,DELETE');
    response.header('Access-Control-Allow-Origin', '*');
    next();
});


var users = [];

var rooms = []; //make an array to hold rooms

app.get('/rooms', function(req, res) {  //req = request, res = response
	var user = users[req.params.id];
	var userRooms=[];
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

	socketRooms.push(newRoom);
	io.sockets.emit('createdRoom', rooms);
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
		username: req.body.username
	};
	
	room.players.push(newPlayer);
	res.json(room);
			
	/*io.socket.room = room.players;
	io.socket.join(room.players);
	io.sockets.emit('playerEnter', socket.room);*/
});

app.put('/rooms/:id/players', function(req, res){
	var room = rooms[req.params.id];
	var leavePlayer = {
		username: req.body.username
	};
	for(var i = room.players.length -1; i >= 0; i--){
		//var object = room.players[i];	
			if(_.isEqual(room.players[i], leavePlayer)){
				room.players.splice(i, 1);
				//res.json(room);
			}	
	}
	res.json(room);
});

app.post('/users', function(req, res){
	var newUser = {
		username: req.body.username,
		id: users.length
	}
	users.push(newUser);
	res.json(newUser);
});

/*app.delete('/rooms/:id/players', function(req, res){
	var room = rooms[req.params.id];
	io
	//delete room.players[req.params.id];
	res.json(room);
});
/*io.on('player left', function(playerList){

});*/


server.listen(process.env.PORT || 8100); //if port doesn't work, use port 8100