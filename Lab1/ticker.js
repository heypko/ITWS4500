// Function to run both tickers
function tick() {
  var tweetJSON = $.getJSON( "TwitterTweets17.json", function( data ) {

    // Get List of Tweets
    var tweets = document.getElementsByClassName('tweetbox');

    // Get List of Hashtags
    var hashtags = document.getElementsByClassName('hashbox');

    // Create array to store Hashtags
    var taglist = [];

    // Cycle through tweets and remove bad tweets
    for (var p = 0, len = data.length; p < len; ++p) {
      // Filter for good tweets
      if (!('limit' in data[p])){
        for (var k = 0, htags = data[p].entities.hashtags.length; k < htags; ++k) {
          taglist.push("#"+data[p].entities.hashtags[k].text);
        }
      }
      // Remove bad tweets
      else {
        data.splice(p, 1);
        p--;
        len--;
      }
    }

    // Cycle Hashtags
    function clock() {

        // Element Deletion
        $(hashtags[0]).slideUp(300);
        setTimeout(function(){$(hashtags[0]).remove();}, 300);

        // Element Creation in DOM
        var liclass = document.createElement('li');
        liclass.setAttribute("class", "hashbox");
        liclass.setAttribute("id", data[0].id);
        var aclass = document.createElement('a');
        aclass.setAttribute("class", "animated bounceInLeft");
        liclass.appendChild(aclass);
        aclass.innerHTML = taglist[0];

        // Cycle JSON Data
        taglist.push(taglist.shift());

        // Add Element to DOM
        $(hlist).append(liclass);
    }

    // Cycle Tweets
    function tock() {

        // Element Deletion
        $(tweets[0]).slideUp(300);
        setTimeout(function(){$(tweets[0]).remove();}, 300);

        // Element Creation in DOM
        var liclass = document.createElement('li');
        liclass.setAttribute("class", "tweetbox");
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

    // Initiailze First 5 Hashtags
    for (var p = 0; p < 5; ++p) {
      clock();
    }

    // Initiailze First 5 Tweets
    for (var p = 0; p < 5; ++p) {
      tock();
    }

    // Constantly run ticker functions
    setInterval(tock, 3000);
    setInterval(clock, 4000);

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
