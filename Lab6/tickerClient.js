var latitude = "73.68";
var longitude = "42.72";

var socket = io();

// Default Search
// var apiString = "https://api.twitter.com/1.1/search/tweets.jsonq=&geocode=+"+latitude+","+longitude;

/* Sample Local Files */
var ngapp = angular.module('myApp', ['ng']);
ngapp.controller('myCtrl', function($scope, $http) {
  $scope.types = ['JSON', 'CSV'];

  
  $scope.runSearch = function() {
    var searchOptions = ["search", $scope.query, $scope.number];
    socket.send(searchOptions);

    return false;
  };

  $scope.runExport = function() {
    var searchOptions = ["export", $scope.format];
    socket.send(searchOptions);

    return false;
  };

  // on msg received, append to list
  socket.on('message', function(msg){
    $scope.myTweets = msg;
    console.log($scope.myTweets);
    $scope.$apply();
  });

});
