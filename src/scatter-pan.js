
import * as d3 from 'd3';
import * as Leap from 'leapjs';
import 'leapjs-plugins';
import './zoom.css';
import _ from 'lodash';

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
            .attr("id", "innerSpace")
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
        .style("fill", "#cc00ff")

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



function zoomOut(selection) {
    var zoomOutTransform = d3.zoomIdentity.translate(0,0).scale(1);
    selection
        .transition()
            .duration(2000)
            .ease(d3.easeQuadInOut)
            .call(zoom.transform, zoomOutTransform);
}

function zoomed() {
    var new_xScale = d3.event.transform.rescaleX(x);
    var new_yScale = d3.event.transform.rescaleY(y);
    console.log("d3 transform event: ");
    console.log(d3.event.transform);

    gX.call(xAxis.scale(new_xScale));
    gY.call(yAxis.scale(new_yScale));

    dots.attr("transform", d3.event.transform);
}

function simulateClick (elem, pos) {
    var event = new MouseEvent('dblclick', {
        view: window,
        clientX: pos[0],
        clientY: pos[1],
        bubbles: true,
        cancelable: true
      });

    console.log("simulate click is called!");
    console.log(elem);
    console.log("at position: " + pos);
    var cancelled = !elem.dispatchEvent(event);
    // var cancelled = !window.dispatchEvent(event);
    //   var cb = document.getElementById('circle1'); 
    //   var cancelled = !cb.dispatchEvent(event);
    //   if (cancelled) {
    //     // A handler called preventDefault.
    //     alert("cancelled");
    //   } else {
    //     // None of the handlers called preventDefault.
    //     alert("not cancelled");
    //   }
}

function simulateMouseUp (elem, pos) {
    var event = new MouseEvent('mouseup', {
        view: window,
        clientX: pos[0],
        clientY: pos[1],
        k: 2,
        bubbles: true,
        cancelable: true
    });

    console.log("simulate mouseup is called!");
    console.log(elem);
    var cancelled = !elem.dispatchEvent(event);
}

function simulateDragStart (elem, pos) {
    var event = new MouseEvent('dragstart', {
        view: window,
        clientX: pos[0],
        clientY: pos[1],
        bubbles: true,
        cancelable: true
    });
    console.log("simulate start drag is called!");
    console.log(elem);
    var cancelled = !elem.dispatchEvent(event);
}

function simulateDragEnd (elem, pos) {
    var event = new MouseEvent('dragend', {
        view: window,
        clientX: pos[0],
        clientY: pos[1],
        bubbles: true,
        cancelable: true
    });
    console.log("simulate start end is called!");
    console.log(elem);
    var cancelled = !elem.dispatchEvent(event);
}



var normalizedDisplay = document.getElementById("normPosition");
var palmDisplay = document.getElementById("palmPosition");
var windowDisplay = document.getElementById("windowPosition");

var scatterPosition = [0,0];
var normalizedPosition = [0,0,0];
var isGrabbing = false;
var dotsElem = document.getElementById("innerSpace");

var currPosition = [width/2, height/2];
var dragCount = 0;

var controller = Leap.loop({enableGestures: true}, function(frame){
    if (!isGrabbing) {
        scatter.select('#cursor').remove();        
    }  

    if (frame.valid) {
        if (frame.hands.length > 0) {
            var hand = frame.hands[0];
            var position = hand.palmPosition;
            var interactionBox = frame.interactionBox;
            var normalizedPosition = interactionBox.normalizePoint(position, true);
            // the y coordinate is inverted from what it should be
            normalizedPosition[1] = 1 - normalizedPosition[1];
            var palmPosition = position;
            var oldGrabStrength = hand.grabStrength;
            var oldPinchStrength = hand.pinchStrength;
            scatterPosition = [normalizedPosition[0] * width, normalizedPosition[1] * height];
            normalizedDisplay.innerText = "(" + normalizedPosition[0] + ", "
                                              + normalizedPosition[1] + ", "
                                              + normalizedPosition[2] + ")";
            palmDisplay.innerText = "(" + palmPosition[0] + ", " 
                                       + palmPosition[1] + ", "
                                       + palmPosition[2] + ")";
            windowDisplay.innerText = "(" + scatterPosition[0] + ", " + scatterPosition[1] + ")";
            
            
            if (hand.grabStrength >= 0.95 || hand.pinchStrength >= 0.95) { // can change this threshold
                if (isGrabbing == false) {
                    simulateDragStart(dotsElem, scatterPosition);

                } else {
                    var diffVector = [scatterPosition[0]-currPosition[0], scatterPosition[1]-currPosition[1]];
                    console.log("dragging by: " + diffVector);
                    var transformString = "translate(" + diffVector[0] + "," + diffVector[1] + ")";
                    var baseZoom = svg.call(zoom.translateBy, diffVector[0], diffVector[1]);
                    currPosition = [scatterPosition[0], scatterPosition[1]];
                }
                dragCount += 1;
                isGrabbing = true;
            } else {
                if (isGrabbing == true) {
                    simulateDragEnd(dotsElem, scatterPosition);
                }
                isGrabbing = false;
                scatter.append('circle')
                        .attr('r', 10)
                        .attr('cx', scatterPosition[0])
                        .attr('cy', scatterPosition[1])
                        .attr('fill', 'red')
                        .attr('opacity', 0.5)
                        .attr('id', 'cursor');
            }
            
        }
    } 
  });
  controller.connect();

  var processSpeech = function(transcript) {
    // Helper function to detect if any commands appear in a string
    var userSaid = function(str, commands) {
      var lowercaseStr = str.toLowerCase();
      for (var i = 0; i < commands.length; i++) {
        if (lowercaseStr.indexOf(commands[i]) > -1)
          return true;
      }
      return false;
    };
  
    // console.log("transcript below:");
    console.log(transcript);

    if (userSaid(transcript, ['increase'])) {
        console.log('zoom in');
        // var baseZoom = d3.zoomIdentity.duration(750).translate(scatterPosition[0],scatterPosition[1]).scale(2);
        // dots.call(zoom.transform, baseZoom);
        // simulateClick(dotsElem, scatterPosition);
        var diffVector = [scatterPosition[0]-currPosition[0], scatterPosition[1]-currPosition[1]];
        console.log("zoom translating by: " + diffVector);
        var baseZoom = svg.call(zoom.translateBy, diffVector[0], diffVector[1]);
        svg.call(zoom.scaleBy, 2);
        currPosition = [scatterPosition[0], scatterPosition[1]];

    } else if (userSaid(transcript, ['out'])) {
        console.log('zoom out');
        // var baseZoom = d3.zoomIdentity.translate(0,0).scale(1);
        svg.call(zoom.scaleBy, 0.5);
        // dots.call(zoom.transform, baseZoom);
    } else {
        console.log('false');
    }
};

var DEBUGSPEECH = true;
console.log(processSpeech);
var debouncedProcessSpeech = _.debounce(processSpeech, 500);

console.log("loading setup speech");
var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onresult = function(event) {
  // Build the interim transcript, so we can process speech faster
  var transcript = '';
  var hasFinal = false;
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal)
      hasFinal = true;
    else
      transcript += event.results[i][0].transcript;
  }
  // console.log(event);

  if (hasFinal)
    console.log("SPEECH DEBUG: ready");
  else
    console.log("SPEECH DEBUG: " + transcript);
  

  var processed = debouncedProcessSpeech(transcript);
  // var processed = processSpeech(transcript);

  // If we reacted to speech, kill recognition and restart
  if (processed) {
    recognition.stop();
  }
};
// Restart recognition if it has stopped
recognition.onend = function(event) {
  setTimeout(function() {
    recognition.start();
  }, 1000);
};
recognition.start();