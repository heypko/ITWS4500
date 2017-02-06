// Function to make request and run ticker
function tick() {
  var weatherJSON = $.getJSON( "TwitterTweets17.json", function( data ) {

    navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);

    // Get List of weathers
    var weatherCards = document.getElementsByClassName('weatherbox');

    // Cycle Weather Cardts
    function tock() {

        // Element Deletion
        $(weatherCards[0]).slideUp(300);
        setTimeout(function(){$(weatherCards[0]).remove();}, 300);

        // Element Creation in DOM
        var liclass = document.createElement('li');
        liclass.setAttribute("class", "weatherbox");
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

    // Initiailze Weather Card
    // for (var p = 0; p < 5; ++p) {
    //   tock();
    // }

    // Constantly run ticker functions
    setInterval(tock, 3000);

    // Get Data on Click
    $("ul").on("click", ".weatherbox", function() {
      var flag = false;
      console.log(this.id);
      for (var i = 0; i < data.length; i++) {
          if (data[i].id == this.id) {
              flag = true;
              break;
          }
      }

      // Change weather info if match found
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
