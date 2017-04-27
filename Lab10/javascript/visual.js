var margin = {top: 100, right: 30, bottom: 100, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var wordgraph = [];

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5);

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var circle = d3.selectAll("circle");
circle.style("fill", "steelblue");
circle.data([32, 57, 112]);
circle.attr("r", function(d) { return Math.sqrt(d); });


d3.csv("./downloadCSV", type, function(error, data) {
  // START BAR CHART
  x.domain(data.map(function(d) { return d["user.screen_name"]; }));
  y.domain([0, d3.max(data, function(d) { return parseInt(Math.ceil(d["user.favourites_count"]
                                                  / d["user.statuses_count"])); })]);

  circle.data()
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .attr("transform", "translate(-12, 50) rotate(-90)");

  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("favourites / status");

  chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d["user.screen_name"]); })
      .attr("y", function(d) { return y(d["user.favourites_count"]/d["user.statuses_count"]); })
      .attr("height", function(d) { return height - y(d["user.favourites_count"]/d["user.statuses_count"]); })
      .attr("width", x.rangeBand());
  // END BAR CHART


  // START DATA MAPPING
  var split;
  var hashmap = {};
  // Go through individual tweet
  for (var i = 0; i < data.length; ++i) {
    split = data[i].text.split(" ");
    // Go through split string
    for (var j = 0; j < split.length; ++j) {
      var lower = split[j].toLowerCase()
      if (lower.length < 2 || lower.length > 18) {
        break;
      }
      // Check to see if already exists
      if (lower in hashmap) {
        hashmap[lower] = hashmap[lower] + 1;
      }
      else {
        hashmap[lower] = 0;
      }
    }
  }
  // END DATA MAPPING

  var words = Object.keys(hashmap);
  console.log(words);

  // START WORD GRAPH
  var fill = d3.scale.category20();
  var layout = d3.layout.cloud()
      .size([500, 500])
      .words(
        words.map(function(d) {
        return {text: d, size: hashmap[d]*20};
      }))
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw);

  layout.start();

  function draw(words) {
    d3.select("body").append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }
  // END WORD GRAPH
});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}
