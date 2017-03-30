var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
var json2csv = require('json2csv');

var fields = ['created_at', 'id', 'text', 'user.id', 'user.name', 'user.screen_name',
              'user.location', 'user.followers_count', 'user.friends_count',
              'user.created_at', 'user.time_zone', 'user.profile_background_color',
              'user.profile_image_url', 'geo', 'coordinates'];



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

    app.get('/downloadJSON', function (req, res) {
      res.download(__dirname + '/latestSearch.json');
      console.log('JSON Success!');
    });

    app.get('/downloadCSV', function (req, res) {
      res.download(__dirname + '/latestSearch.csv');
      console.log('CSV Success!');
    });

    var searchString = ''; // defualt
    var numTweets = 10; // default

    /** Twitter Search
     *  Look up 0-100 tweets using an input search query
     */
    if (msg[0] == "search") {
      // Default Search
      if (msg[1] == null || msg[2] == null) {
        client.get('search/tweets', {q: "rpi", geocode: "42.72,-73.68,10km", count: numTweets}, function(error, tweets, response) {
          if(error) throw error;
          // Bind variable to tweet statuses & send to client
          mySearch = tweets.statuses;
          socket.send(mySearch);
          console.log("Sent Default Search");

          // Write to json file
          var filename = "./latestSearch.json";
          fs.writeFile(filename, JSON.stringify(mySearch), (err) => {
            if (err) throw err;
            console.log('Successfully wrote to latestSearch.json');
          });

          // Convert to CSV file
          var csvname = "./latestSearch.csv";
          var csv = json2csv({ data:mySearch, fields: fields});

          fs.writeFile(csvname, csv, function(err) {
            if (err) throw err;
            console.log("Successfully wrote to latestSearch.csv");
          });

        });
      }

      // Targeted Search
      else {
        searchString = msg[1];
        numTweets = parseInt(msg[2]);
        client.get('search/tweets', {count: numTweets, q: searchString}, function(error, tweets, response) {
          if(error) throw error;
          // Bind variable to tweet statuses & send to client
          mySearch = tweets.statuses;
          socket.send(mySearch);
          console.log("Sent Targeted Search");

          // Write to json file
          var filename = "./latestSearch.json";
          fs.writeFile(filename, JSON.stringify(mySearch), (err) => {
            if (err) throw err;
            console.log('Successfully wrote to latestSearch.json');
          });

          // Convert to CSV file
          var csvname = "./latestSearch.csv";
          var csv = json2csv({ data:mySearch, fields: fields});

          fs.writeFile(csvname, csv, function(err) {
            if (err) throw err;
            console.log("Successfully wrote to latestSearch.csv");
          });

        });
      }
    }

    /** Export
     *  Return files for download as .json or .csv
     */
    // if (msg[0] == "export") {
    //   if (msg[1] == "JSON") {
    //     console.log('Attempting to export latestSearch.json');
    //
    //   }
    //
    //   else if (msg[1] == "CSV") {
    //     console.log('Attempting to export latestSearch.csv');
    //
    //   }
    // }
  });
});


server.listen(3000, function () {
  console.log('Server up on *:3000');
})
