var latitude = "73.68";
var longitude = "42.72";
var tweetJSON;
var alert = document.getElementById("alert");
var socket = io();

// Function to run both tickers
function tick() {

  /* Sample Local Files */
  var ngapp = angular.module('myApp', ['ng']);
  ngapp.controller('myCtrl', function($scope, $http) {
    $scope.actions = ['downloadJSON', 'downloadCSV'];

    $scope.runSearch = function() {
      var searchOptions = ["search", $scope.query, $scope.number];
      socket.send(searchOptions);

      // Handle nulls
      if ($scope.query == null || $scope.number == null) {
        alert.innerHTML = "Ran default search for <strong>10</strong> tweets around <strong>Troy, NY</strong>";
      }
      else {
        alert.innerHTML = "Got <strong>" + $scope.number
          + "</strong> tweets of <strong>" + $scope.query
          + "</strong> (also saved search to database so we can sell your information!)";
      }
      return false;
    };

    $scope.setName = function() {
      // Null Check
      var fileName = "latestSearch";
      if ($scope.nameSet != null) {
        fileName = $scope.nameSet;
        alert.innerHTML = "Set name of file download to <strong>"
                          + $scope.nameSet+ "</strong>";
      }
      else {
        alert.innerHTML = "Default name of file set to <strong>"
                          + fileName +"</strong>";
      }
      var nameOptions = ["setName", fileName];
      socket.send(nameOptions);
      return false;
    }

  });


  $.getJSON( "/downloadJSON", function( data ) {
    // on msg received, append to list
    socket.on('message', function(msg){
      // Update JSON file
      data = msg;
      cycle();
    });

    // Get List of Tweets
    var tweets = document.getElementsByClassName('tweetbox');

    // Cycle Tweets
    function tock() {

        // Element Deletion
        $(tweets[0]).slideUp(300);
        setTimeout(function(){$(tweets[0]).remove();}, 300);

        // Element Creation in DOM
        var liclass = document.createElement('li');
        liclass.setAttribute("class", "tweetbox");
        if (data[0].followers_count > 50) {
          liclass.setAttribute("class", "tweetbox", "btn-warning");
        }
        liclass.setAttribute("id", data[0].id);
        var aclass = document.createElement('a');
        aclass.setAttribute("class", "animated bounceInLeft");
        liclass.appendChild(aclass);
        aclass.innerHTML = data[0].text;

        // Cycle JSON Data
        data.push(data.shift());

        // Add Element to DOM
        $(tlist).append(liclass);
    }

    // Cycle new tweets
    function cycle() {
      // Initiailze First 5 Tweets
      for (var p = 0; p < 5; ++p) {
        tock();
      }
    }
    cycle();

    // Constantly run ticker functions
    setInterval(tock, 3000);

    // Get Data on Click
    $("ul").on("click", ".tweetbox", function() {
      var flag = false;
      console.log(this.id);
      for (var i = 0; i < data.length; i++) {
          if (data[i].id == this.id) {
              flag = true;
              break;
          }
      }

      // Change tweet info if match found
      if (flag == true){
        document.getElementById("portrait").src = data[i].user.profile_image_url;
        document.getElementById("username").innerHTML = data[i].user.screen_name;
        document.getElementById("description").innerHTML = data[i].user.description;
        document.getElementById("text").innerHTML = data[i].text;
      }
    });

  });
};

// Run Ticker
tick();
