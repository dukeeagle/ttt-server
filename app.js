//dependencies 	
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(cors());

var users = [];
function UserIsClose(lat1, lat2, lon1, lon2){
	var R = 6371000; //Earth's radius in metres
	var lat1Rad = lat1.toRadians();
	var lat2Rad = lat2.toRadians();
	var deltaLat = (lat2-lat1).toRadians();
	var deltaLon = (lon2-lon1).toRadians();

	var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
			Math.cos(lat1Rad) * Math.cos(lat2Rad) *
			Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));  //angular distance in radians

	var d = R * c;	//distance between the two points

	if(d <= 8000){
		return true;
	}else{
		return false;
	}
}

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
		lat:req.body.lat,
		lon:req.body.lon, 
		messages: []
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

app.post('/users', function(req, res){
	var newUser = {
		username: req.body.username,
		lat: req.body.lat,
		lon: req.body.lon,
		id: users.length
	}
	users.push(newUser);
	res.json(newUser);
});

app.listen(process.env.PORT || 4730); //if port doesn't work, use port 4730