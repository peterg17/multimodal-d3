
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import * as Leap from 'leapjs';
import 'leapjs-plugins';
import './zoom.css';

function randomData(samples) {
    var data = [],
        random = d3.randomNormal();
    
    for (var i = 0; i < samples; i++) {
        data.push({
            x: random(),
            y: random()
        });
    }
    return data;
}

var data = randomData(300);

var margin = { top: 20, right: 20, bottom: 30, left: 30 };
var width = 900 - margin.left - margin.right;
var height = 480 - margin.top - margin.bottom;

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var x = d3.scaleLinear()
        .range([0, width])
        .nice();

var y = d3.scaleLinear()
        .range([height, 0]);

var xAxis = d3.axisBottom(x).ticks(12),
    yAxis = d3.axisLeft(y).ticks(12 * height / width);


var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);


var zoom = d3.zoom()
        .on("zoom", zoomed);

var innerSpace = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);

var view = innerSpace.append("rect")
            .attr("class", "zoom")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

var clip = svg.append("defs").append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

var xExtent = d3.extent(data, function (d) { return d.x; });
var yExtent = d3.extent(data, function (d) { return d.y; });
x.domain(d3.extent(data, function (d) { return d.x; })).nice();
y.domain(d3.extent(data, function (d) { return d.y; })).nice();

// var scatter = svg.append("g")
//     .attr("id", "scatterplot")
//     .attr("clip-path", "url(#clip)");

var scatter = innerSpace.append("g")
        .attr("clip-path", "url(#clip)");

var dots = scatter.selectAll(".dot")
        .data(data)
    .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 4)
        .attr("cx", function (d) { return x(d.x); })
        .attr("cy", function (d) { return y(d.y); } )
        .attr("opacity", 0.5)
        .style("fill", "#4292c6")

var gX = innerSpace.append("g")
    .attr("class", "x axis")
    .attr('id', "axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

innerSpace.append("text")
    .style("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 8)
    .text("X Label");

var gY = innerSpace.append("g")
    .attr("class", "y axis")
    .attr('id', "axis--y")
    .call(yAxis);

innerSpace.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .text("Y Label");





function zoomed() {
    var new_xScale = d3.event.transform.rescaleX(x);
    var new_yScale = d3.event.transform.rescaleY(y);
    console.log("d3 transform event: ");
    console.log(d3.event.transform);

    gX.call(xAxis.scale(new_xScale));
    gY.call(yAxis.scale(new_yScale));

    dots.attr("transform", d3.event.transform);
}



