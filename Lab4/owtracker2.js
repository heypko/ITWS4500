playerArray = [];
playerArray.push("profiles/deadcake.json");
playerArray.push("profiles/highpants.json");
playerArray.push("profiles/confusedpube.json");
playerArray.push("profiles/geth.json");


// Function to make request and run ticker
function tick(latitude, longitude) {
  var apiString = "https://api.forecast.io/forecast/ab229f452201da190c58043082aff43f/"
                              +latitude+","+longitude;

  /* Sample Local Files */
  var owapp = angular.module('myPlayers', ['ng']);

  infoArray = [];

  /* ------------------------------ */
  owapp.controller('playersCtrl', function($scope, $http) {

    angular.forEach(playerArray, function(playerArray){
      $http.get(playerArray).then(function(res) {
        infoArray.push(res.data);
        console.log(infoArray[infoArray.length-1].battletag + " info pushed.");
      });
    });

    $scope.myData = infoArray;

    // Weather API Interfacing
    $http.jsonp(apiString+'?alt=json-in-script&callback=JSON_CALLBACK').then (function(response) {
        document.getElementById("portrait").innerHTML =
                  "<i class=\"wi wi-forecast-io-"+response.data.currently.icon+"\"></i>";
        document.getElementById("temperature").innerHTML =
                  Math.round(response.data.currently.temperature, 0) + "&#x2109";
        $scope.summary = response.data.currently.summary;

        // Parse & Print Time
        var myDate = new Date( response.data.currently.time *1000);
        dateString1 = myDate.toDateString();
        dateString2 = formatAMPM(myDate);
        $scope.time1 = dateString1;
        $scope.time2 = dateString2;
    });
  });
  /* ------------------------------ */
  owapp.directive('toggleClass', function() {
      return {
          restrict: 'A',
          link: function(scope, element, attrs) {
              element.bind('click', function() {
                  element.toggleClass("red");
                  element.toggleClass("blue");
              });
          }
      };
  });
}

// Run Weather API on location of Troy Campus
tick(42.730119699999996, -73.68177519999999);


function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours < 10 ? '0'+hours: hours;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
