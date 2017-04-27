var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
var json2csv = require('json2csv');
var json2xml = require('json2xml');

// Declare MongoClient variable
var MongoClient = require('mongodb').MongoClient;
var MongoURL = "mongodb://localhost:27017/websciLabs";

// Connect to the db
MongoClient.connect(MongoURL, function(err, db) {
  if(!err) {
    console.log("Connected to mongoDB tweetStorage @ " + MongoURL);
  }
  var collection = db.collection('tweetStorage');

  var downloadName = "latestSearch";

var fields = ['JSONcreated_at', 'id', 'text', 'user.id', 'user.name', 'user.screen_name',
              'user.location', 'user.followers_count', 'user.friends_count',
              'user.created_at', 'user.time_zone', 'user.profile_background_color',
              'user.profile_image_url', 'user.favourites_count', 'user.statuses_count', 'geo', 'coordinates', 'retweet_count'];

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

app.get('/visual', function (req, res) {
  res.sendFile(__dirname + '/visualization.html');
})


// JSON
app.get('/downloadJSON', function (req, res) {
  // Get file from mongoDB
  collection.find().toArray(function(err, docs) {
    // Write to json file
    var filename = "./latestSearch.json";
    fs.writeFile(filename, JSON.stringify(docs[0].JSONoutput), (err) => {
      //console.log(JSON.stringify(docs[0]));
      if (err) throw err;
      console.log('Successfully wrote to latestSearch.json');
      // Set Download Link
      res.download(__dirname + '/latestSearch.json', downloadName + '.json');
      console.log('JSON Success!');
    });
  });
});

// CSV
app.get('/downloadCSV', function (req, res) {
  // Get file from mongoDB
  collection.find().toArray(function(err, docs) {
    // Convert to CSV file
    var csvname = "./latestSearch.csv";
    var csv = json2csv({ data:docs[0].JSONoutput, fields: fields});
    // Write to latestSearch.csv
    fs.writeFile(csvname, csv, function(err) {
      if (err) throw err;
      console.log("Successfully wrote to latestSearch.csv");
      // Set Download Link
      res.download(__dirname + '/latestSearch.csv', downloadName + '.csv');
      console.log('CSV Success!');
    });
  });
});

// XML
app.get('/downloadXML', function (req, res) {
  // Get file from mongoDB
  collection.find().toArray(function(err, docs) {
    // Convert to CSV file
    var xmlname = "./latestSearch.xml";
    var xml = json2xml(docs[0].JSONoutput);
    // Write to latestSearch.csv
    fs.writeFile(xmlname, xml, function(err) {
      if (err) throw err;
      console.log("Successfully wrote to latestSearch.xml");
      // Set Download Link
      res.download(__dirname + '/latestSearch.xml', downloadName + '.xml');
      console.log('XML Success!');
    });
  });
});

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
  socket.on('message', function(msg, res){
    // log chat msg
    console.log(msg);
    var mySearch = [];

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
          var JSONoutput = mySearch;

          // Store in DB
          collection.save({_id:'recent', JSONoutput}, function(err, result) {
            if (err) throw err;
            console.log("Inserted JSON to mongoDB");
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
          var JSONoutput = mySearch;

          // Store in DB
          collection.save({_id:'recent', JSONoutput}, function(err, result) {
            if (err) throw err;
            console.log("Inserted JSON to mongoDB");
          });
        });
      }
    }

    /** Set filename
     *  Set filename for future export
     */
    else if (msg[0] == "setName") {
      if (msg[1] != null) {
          downloadName = msg[1];
      }
    }
  });
});

});

server.listen(3000, function () {
  console.log('Server up on *:3000');
})
