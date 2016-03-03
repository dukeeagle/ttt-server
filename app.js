//dependencies
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(cors());

var messages = []; //make an array to hold messages

app.get('/messages', function(req, res) {  //req = request, res = response
	res.json(messages);
});

app.get('/messages/:id', function(req,res) {
	var message = messages[req.params.id];
	res.json(message);
});

function getDistance(lat1, lat2, lon1, lon2){
		var R = 6371000; //Earth's radius in metres
		var lat1Rad = lat1.toRadians();
		var lat2Rad = lat2.toRadians();
		var deltaLat = (lat2-lat1).toRadians();
		var deltaLon = (lon2-lon1).toRadians();

		var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
		Math.cos(lat1Rad) * Math.cos(lat2Rad) *
		Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));  //angular distance in radians

	var d = R * c;	//distance between the two points (in meters?)
	return d;
}

app.post('/messages', function(req,res){
	var newMessage = {
		message:req.body.message,
		username:req.body.username,
		timestamp: new Date(),
		lat:req.body.lat,
		lon:req.body.lon,
		distance:req.body.;
	};

	messages.push(newMessage);
	res.json(messages);
});


app.listen(process.env.PORT || 4730); //if port doesn't work, use port 4730