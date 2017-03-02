var latitude = "73.68";
var longitude = "42.72";

var socket = io();

// Default Search
// var apiString = "https://api.twitter.com/1.1/search/tweets.jsonq=&geocode=+"+latitude+","+longitude;

/* Sample Local Files */
var ngapp = angular.module('myApp', ['ng']);
ngapp.controller('myCtrl', function($scope, $http) {
  $scope.runSearch = function() {
    var searchOptions = [$scope.query, $scope.number];
    socket.send(searchOptions);
    //socket.send(apiString+',1km&lang=pt&result_type=recent');
    // Weather API Interfacing
    // $http.jsonp(apiString+',1km&lang=pt&result_type=recent').then(function(response) {
    //   myTweets = response.statuses;
    // });
    // angular.forEach(playerArray, function(playerArray){
    //   $http.get(playerArray).then(function(res) {
    //     infoArray.push(res.data);
    //     console.log(infoArray[infoArray.length-1].battletag + " info pushed.");
    //   });
    // });
    return false;
  };
  // on msg received, append to list
  socket.on('message', function(msg){
    $scope.myTweets = msg;
    console.log($scope.myTweets);
    $scope.$apply();
  });

});
