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

app.post('/messages', function(req,res){
	var newMessage = {
		message:req.body.message,
		username:req.body.username,
		timestamp: new Date()
	};

	messages.push(newMessage);
	res.json(messages);
});


app.listen(process.env.PORT || 4730); //if port doesn't work, use port 4730
