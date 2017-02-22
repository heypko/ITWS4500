// ****************************************** DYNAMIC LOOP
// var players = [ "deadcake.json",
//                 "highpants.json",
//                 "geth.json",
//                 "confusedpube.json"  ];

sendGet();

// sendGet function
function sendGet() {

  // // Element Creation in DOM
  // var liclass = document.createElement('li');
  // liclass.setAttribute("class", "playerbox col-xs-6");
  //
  // var aclass = document.createElement('a');
  // aclass.setAttribute("class", "playerinfo animated bounceInRight");
  //
  // var imgclass = document.createElement('img');
  // imgclass.setAttribute("class", "proPic");
  // imgclass.setAttribute("ng-src", "{{"+playerID+"playerIcon}}");
  //
  // var ulclass = document.createElement('ul');
  // var battletag = document.createElement('li');
  //
  // //playerID = playerID.replace("-", "#");
  //
  // var seasonrank = document.createElement('li');
  // seasonrank.innerHTML = "{{ 'SR: ' + "+playerID+"playerSR }}";
  //
  // liclass.appendChild(aclass);
  // aclass.appendChild(imgclass);
  // aclass.appendChild(ulclass);
  // ulclass.appendChild(battletag);
  // ulclass.appendChild(seasonrank);
  //
  // // Add Element to DOM
  // $(tlist).append(liclass);

  /* Sample Local Files */
  var app = angular.module('myPlayers', ['ng']);
  app.controller('playersCtrl', function($scope, $http) {

    $http.get("profiles/deadcake.json").then(function(response) {
      // console.log(playerID+ " " + response.data.us.stats.competitive.overall_stats.comprank);
      $scope.playerTag1 = response.data.battletag;
      $scope.playerSR1 = response.data.us.stats.competitive.overall_stats.comprank;
      $scope.playerIcon1 = response.data.us.stats.competitive.overall_stats.avatar;
    });
    $http.get("profiles/highpants.json").then(function(response) {
      // console.log(playerID+ " " + response.data.us.stats.competitive.overall_stats.comprank);
      $scope.playerTag2 = response.data.battletag;
      $scope.playerSR2 = response.data.us.stats.competitive.overall_stats.comprank;
      $scope.playerIcon2 = response.data.us.stats.competitive.overall_stats.avatar;
    });

    $http.get("profiles/confusedpube.json").then(function(response) {
      // console.log(playerID+ " " + response.data.us.stats.competitive.overall_stats.comprank);
      $scope.playerTag3 = response.data.battletag;
      $scope.playerSR3 = response.data.us.stats.competitive.overall_stats.comprank;
      $scope.playerIcon3 = response.data.us.stats.competitive.overall_stats.avatar;
    });

    $http.get("profiles/geth.json").then(function(response) {
      // console.log(playerID+ " " + response.data.us.stats.competitive.overall_stats.comprank);
      $scope.playerTag4 = response.data.battletag;
      $scope.playerSR4 = response.data.us.stats.competitive.overall_stats.comprank;
      $scope.playerIcon4 = response.data.us.stats.competitive.overall_stats.avatar;
    });
  });



  app.directive('toggleClass', function() {
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



//************************************************* OnClick
  // var app = angular.module('myPlayers', ['ng']);
  // app.controller('playersCtrl', function($scope, $http) {
  //   $( ".playerinfo" ).click(function() {
  //     playerID = this.id;
  //     $http.get("https://owapi.net/api/v3/u/"+playerID+"/stats").then(function(response) {
  //       console.log(response);
  //       $scope.playerSR = response.data.us.stats.competitive.overall_stats.comprank;
  //       $scope.playerIcon = response.data.us.stats.competitive.overall_stats.avatar;
  //     });
  //   });
  // });



// Function to make request and run ticker
function tick(latitude, longitude) {
  var apiString = " https://api.forecast.io/forecast/ab229f452201da190c58043082aff43f/"
                              +latitude+","+longitude;

  /* Sample Local Files */
  var weatherapp = angular.module('weather', ['ng']);
  weatherapp.controller('weatherCtrl', function($scope, $http) {
    $http.jsonp(apiString+'?alt=json-in-script&callback=JSON_CALLBACK').then (function(response) {
        console.log(response.data.currently.icon);

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

  // $.ajax({
  //   url: apiString,
  //   dataType: "jsonp",
  //   success: function (data) {
  //
  //         // Print out current weather
  //
  //         // document.getElementById("temperature").innerHTML = Math.round(data.currently.temperature, 0) + "&#x2109";
  //         // document.getElementById("description").innerHTML = data.currently.summary;
  //         //
  //         // // Parse & Print Time
  //         // var myDate = new Date( data.currently.time *1000);
  //         // dateString1 = myDate.toDateString();
  //         // dateString2 = formatAMPM(myDate);
  //         // document.getElementById("time1").innerHTML = dateString1;
  //         // document.getElementById("time2").innerHTML = dateString2;
  //
  //
  //   }
  // });

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
