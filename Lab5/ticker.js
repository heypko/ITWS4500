var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');


var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: 'LSHRdpW2F0BaXWDwhJPxAlPDG',
    consumer_secret: 'Rmg1DEcgS5DzTNIXStmrsZbuHCjr8mOZ451H5wSaECWEgAPMCP',
    access_token_key: '2736947939-acYvcIAOAn5nt6lpKBMoj1s4oeG2MUS3eEEQMwp',
    access_token_secret: 'c6miqrlojGFamBOjQXTWGHaU2zEgQOoLPomDooQJRYVfJ'
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/ticker.html');
})

app.use(express.static(__dirname));

// user connected even handler
io.on('connection', function(socket){

  // log & brodcast connect event
  console.log('a user connected');

  // log disconnect event
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  // message received event handler
  socket.on('message', function(msg){
    // log chat msg
    console.log(msg);
    var mySearch = [];

    var searchString = ''; // defualt
    var numTweets = 10; // default

    // Default Search
    if (msg[0] == null || msg[1] == null) {
      client.get('search/tweets', {q: "rpi", geocode: "42.72,-73.68,10km", count: numTweets}, function(error, tweets, response) {
        if(error) throw error;
        // Bind variable to tweet statuses & send to client
        mySearch = tweets.statuses;
        socket.send(mySearch);
        console.log("Sent Default Search");

        // Write to File
        var filename = "./latestSearch.json";
        fs.writeFile(filename, JSON.stringify(mySearch), (err) => {
          if (err) throw err;
          console.log('Successfully wrote to latestSearch.json');
        });
      });
    }

    // Targeted Search
    else {
      searchString = msg[0];
      numTweets = parseInt(msg[1]);
      client.get('search/tweets', {count: numTweets, q: searchString}, function(error, tweets, response) {
        if(error) throw error;
        // Bind variable to tweet statuses & send to client
        mySearch = tweets.statuses;
        socket.send(mySearch);
        console.log("Sent Targeted Search");

        // Write to File
        var filename = "./latestSearch.json";
        fs.writeFile(filename, JSON.stringify(mySearch), (err) => {
          if (err) throw err;
          console.log('Successfully wrote to latestSearch.json');
        });
      });
    }
  });
});


server.listen(3000, function () {
  console.log('Server up on *:3000');
})
