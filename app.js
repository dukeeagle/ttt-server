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
var corser = require('corser');
var _ = require('lodash');

var usernames = [];
var socketRooms = [];
io.sockets.on('connection', function(socket){
	socket.emit('hello!');
	console.log('connection');
	
	//TEST
	socket.join('defaultRoom');
	io.sockets.in('defaultRoom').emit('joined', "a user has joined!");

	socket.on('addUser', function(username, room){
		var client = {
			username: username,
			//lat: req.body.lat,
			//lon: req.body.lon,
			id:users.length,
			socket: socket.id,
			userRoom: []
		};
		socket.nickname = client.username;
		//socket.id = users.length;
		//socket.username = username;
		usernames.push(client);
		io.sockets.emit('updateUser', usernames);
		io.sockets.emit('updateRooms', socketRooms);
	});

	//Game Logic
	socket.on('gameStart', function(room){
		var playerCount = room.players.length;
		var traitorIndex = Math.floor((Math.random() * (playerCount)) + 0);
		for(var i = room.players.length - 1; i >= 0; i--){
			if(i === traitorIndex){
				for(var x = usernames.length - 1; x >= 0; x--){
					if(_.isEqual(room.players[traitorIndex].username, usernames[x].username)){
						
						io.to(usernames[x].socket).emit('traitor', "But you were the chosen one!");
					} 
				}
			} else{
				for(var y = usernames.length - 1; y >= 0; y--){
					if(_.isEqual(room.players[i].username, usernames[y].username)){
						io.to(usernames[y].socket).emit('innocent', "You best be cathing them terries");
					}
				}
			}
		}
	});

	socket.on('enterRoom', function(thisRoom){
		socket.join(thisRoom);
		for(var i = users.length -1; i >= 0; i--){
				if(_.isEqual(users[i].socket, socket)){
					users[i].userRoom = thisRoom;
				}	
		}
		io.sockets.emit('updateRoom', socket.room);
		var roomSockets = Object.keys(io.sockets.adapter.rooms[thisRoom])
		io.sockets.in(thisRoom).emit('joinedRoom', "a user has joined!");
		io.sockets.in(thisRoom).emit('playersInRoom', roomSockets);
	});
	socket.on('leaveRoom', function(leftRoom){
		socket.leave(leftRoom);
		/*for(var i = users.length -1; i >= 0; i--){
				if(_.isEqual(users[i].socket, socket.id)){
					users[i].userRoom = undefined;
				}	
		}*/

		io.sockets.emit('updateRoom', socket.nickname + 'has left the room');
	});
	socket.on('disconnect', function(){
			for(var x = rooms.length - 1; x >= 0; x--){	
				for(var y = rooms[x].players.length - 1; y >= 0; y--){
					if(_.isEqual(socket.nickname, rooms[x].players[y].username)){
						rooms[x].players.splice(y, 1);
					}
				}
			}
					
		var i = users.indexOf(socket);
		delete users[i];
		io.sockets.emit('disconnect', socket.nickname);
	});
});


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

/*function haversine(lat1, lon1, lat2, lon2){
  
  var isClose = 0;
    
  Number.prototype.toRad = function() {
     return this * Math.PI / 180;
  } 

  var R = 6371; // earth's radius in km 

  var x1 = lat2-lat1;
  var dLat = x1.toRad();  
  var x2 = lon2-lon1;
  var dLon = x2.toRad();  
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                  Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);  
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;  //in km

  if(d <= 8.04672){ //5 miles
    isClose = 1;
  } 
  return isClose;

  console.log(d);
}*/


var users = [];

var rooms = []; 

app.get('/rooms', function(req, res) {  //req = request, res = response
	var user = users[req.params.id];
	res.json(rooms);
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
		//lat:req.body.lat,
		//lon:req.body.lon,
		userRooms: [],
		messages: [],
		players: []
	};

	/*for(x = users.length - 1; x >= 0; x--){
		for(i = rooms.length - 1; i >= 0; i--){
			var close = haversine(rooms[i].lat, rooms[i].lon, users[x].lat, users[x].lon);
			if(close == 1){
				rooms[i].userRooms.push(users[x].username);
			}
		}
	}*/
	rooms.push(newRoom);
	res.json(rooms);
	res.json(usernames);

	//socketRooms.push(newRoom);
	io.sockets.emit('createdRoom', rooms);
});


app.put('/rooms', function(req, res){
	var delRoom = {
		id:req.body.id,
		username:req.body.username,
		players:req.body.players
	};
	if(delRoom.players.length == 0){
		for(var i = rooms.length -1; i >= 0; i--){
			//var object = room.players[i];	
				if(_.isEqual(rooms[i].id, delRoom.id)){
					rooms.splice(i, 1);
					//res.json(room);
				}	
		}
		res.json(rooms);
	}

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

});

app.put('/rooms/:id/players', function(req, res){
	var room = rooms[req.params.id];
	var leavePlayer = {
		username: req.body.username
	};
	for(var i = room.players.length -1; i >= 0; i--){
			if(_.isEqual(room.players[i], leavePlayer)){
				room.players.splice(i, 1);
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

server.listen(process.env.PORT || 8100); //if port doesn't work, use port 8100