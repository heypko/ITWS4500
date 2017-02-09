// Function to make request and run ticker
function tick(latitude, longitude) {

  var apiString = " https://api.forecast.io/forecast/ab229f452201da190c58043082aff43f/"
                              +latitude+","+longitude;

$.ajax({
  url: "https://api.forecast.io/forecast/ab229f452201da190c58043082aff43f/"+latitude+","+longitude,
  dataType: "jsonp",
  success: function (data) {
        console.log(data);
        // Get List of weathers
        var weatherCards = document.getElementsByClassName('weatherbox');

        // Cycle Weather Cards
        function tock() {

            // Element Deletion
            $(weatherCards[0]).slideUp(300);
            setTimeout(function(){$(weatherCards[0]).remove();}, 300);

            // Element Creation in DOM
            var liclass = document.createElement('li');
            liclass.setAttribute("class", "weatherbox");
            //liclass.setAttribute("id", data[0].id);
            var aclass = document.createElement('a');
            aclass.setAttribute("class", "animated bounceInLeft");
            liclass.appendChild(aclass);
            var topDate = new Date(data.hourly.data[0].time *1000);


            addString = topDate.getMonth() + 1 + "/" +
                        topDate.getDate() + " ";
            addString += formatAMPM(topDate);
            myTemp = Math.round(data.hourly.data[0].temperature);
            addString += " " + myTemp + "&#x2109";
            addString += " " + data.hourly.data[0].summary;
            addString += " <i class=\"wi wi-forecast-io-"+data.hourly.data[0].icon+"\"></i> "
            aclass.innerHTML = addString;

            // Cycle JSON Data
            data.hourly.data.push(data.hourly.data.shift());

            // Add Element to DOM
            $(tlist).append(liclass);
        }

        // Constantly run ticker functions
        setInterval(tock, 8000);

        // Initiailze First 5 Weather Hourly Updates
        for (var p = 0; p < 8; ++p) {
          tock();
        }


        // Print out current weather
        document.getElementById("portrait").innerHTML = "<i class=\"wi wi-forecast-io-"+data.currently.icon+"\"></i>";
        document.getElementById("temperature").innerHTML = Math.round(data.currently.temperature, 0) + "&#x2109";
        document.getElementById("description").innerHTML = data.currently.summary;

        // Parse & Print Time
        var myDate = new Date( data.currently.time *1000);
        dateString1 = myDate.toDateString();
        dateString2 = formatAMPM(myDate);
        document.getElementById("time1").innerHTML = dateString1;
        document.getElementById("time2").innerHTML = dateString2;


  }
});
}

// Try HTML5 geolocation.
if (navigator.geolocation) {


   navigator.geolocation.getCurrentPosition(function( position ) {
     var pos = {
       lat: position.coords.latitude,
       lng: position.coords.longitude
     };
     console.log(pos.lat);
     console.log(pos.lng);

     // Run Ticker
     tick(pos.lat, pos.lng);
   })
}

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
