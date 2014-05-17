var w = 700;
var h = 400;

var projection = d3.geo.albers()
                       .center([1, 30])
                       .scale([2000]);

var path = d3.geo.path()
             .projection(projection);

var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var color = d3.scale.quantize()
                  .range(["rgb(254,237,222)", "rgb(253,190,133)", 
			  "rgb(253,141,60)", "rgb(230,85,13)",
			  "rgb(166,54,3)"]);

d3.json("cntyWater.json", function(json) {

    var waterPctRange = [];

    for (var i = 0; i < json.features.length; i++){
	 waterPctRange.push(json.features[i].properties.pctMine);
	};
    
    color.domain([
	d3.min(waterPctRange),
	d3.max(waterPctRange)
	]);

    svg.selectAll("path")
       .data(json.features)
       .enter()
       .append("path")
       .attr("d", path)
       .style("stroke", "black")
       .style("fill", function(d) {
	            var value = d.properties.pctMine;
	   
	            if (value) {
			return color(value);
			}
	            else {
			return "#fff";
			}
	   })
       .on("mouseover", function(d) {
	   var xPosition = parseFloat(d3.select(this).attr("x"));
	   var yPosition = parseFloat(d3.select(this).attr("y"));

	   d3.select("#tooltip")
	     .style("left", xPosition + "px")
	     .style("top", yPosition + "px")
	     .select("#county")
	     .text(d.properties.NAME)
	     .style("font-weight", "bold");
	   d3.select("#tooltip")
	     .select("#waterUsage")
	     .text(d.properties.pctMine + "%");
	   
	   d3.select("#tooltip").classed("hidden", false);
        })
       .on("mouseout", function() {
	   d3.select("#tooltip").classed("hidden", true);
	});
});
