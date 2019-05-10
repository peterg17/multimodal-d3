import * as d3 from 'd3';
import * as Leap from 'leapjs';
import 'leapjs-plugins';
import './scatter.css';
import * as $ from "jquery";

var offsets = [50,100,150,200,250];
var svgWidth = 960;
var svgHeight = 600;
var svg = d3.select('body')
                .append('svg')
                .attr('width', svgWidth)
                .attr('height', svgHeight);

var g = d3.select("svg").append("g");

g.append('rect')
    .attr('height', svgHeight)
    .attr('id', 'outline')
    .attr('width', svgWidth)
    .attr('stroke', 'black')
    .attr('stroke-width', 4)
    .attr('opacity', 0.25)
    .attr('fill-opacity', 0.0)
    .attr('class', 'border-rect');

var outline = d3.select('#outline');
console.log(outline);
var x0 = outline.attr('x');
var y0 = outline.attr('y');

console.log("x0: " + x0);
console.log("y0: " + y0);

g
    .append('circle')
        .attr('r', 50)
        .attr('cx', 60)
        .attr('cy', 60)
        .attr('fill', 'green')
        .attr('id', 'circle1')
        .on('click', function () { 
            var currentCircle = d3.select(this);
            var currentColor = currentCircle.attr('fill');
            if (currentColor === 'green') {
                currentCircle.attr('fill', 'blue');
            } else {
                currentCircle.attr('fill', 'green');
            }
        });

g
    .selectAll('circle')
    .data(offsets)
    .enter()
    .append('circle')
        .attr('r', 10)
        .attr('cx', function (d) { return  x0 + svgWidth / 2 + d; })
        .attr('cy', function (d) { return y0 + svgHeight / 2 + d; })
        .attr('fill', 'green')
        .on('click', function () { 
            var currentCircle = d3.select(this);
            var currentColor = currentCircle.attr('fill');
            if (currentColor === 'green') {
                currentCircle.attr('fill', 'blue');
            } else {
                currentCircle.attr('fill', 'green');
            }
        });


function simulateClick (elem) {
    var event = new MouseEvent('click', {
        view: window,
        clientX: 60,
        clientY: 60,
        bubbles: true,
        cancelable: true
      });

    console.log("simulate click is called!");
    console.log(elem);
    var cancelled = !elem.dispatchEvent(event);
    //   var cb = document.getElementById('circle1'); 
    //   var cancelled = !cb.dispatchEvent(event);
    //   if (cancelled) {
    //     // A handler called preventDefault.
    //     alert("cancelled");
    //   } else {
    //     // None of the handlers called preventDefault.
    //     alert("not cancelled");+
    //   }
}

var controller = Leap.loop({enableGestures: true}, function(frame){
    g.select('#cursor').remove();

    // if (frame.pointables.length > 0) {
    //     console.log("pointables: ");
    //     console.log(frame.pointables);
    // }

    // if (frame.pointables.length > 0) {
    //     console.log("hands: ");
    //     console.log(frame.hands);
    // } 


    if(frame.valid && frame.gestures.length > 0){
      frame.gestures.forEach(function(gesture){
          switch (gesture.type){
            case "circle":
                console.log("Circle Gesture");
                break;
            case "keyTap":
                console.log("Key Tap Gesture");
                break;
            case "screenTap":
                console.log("Screen Tap Gesture -- simulating click!");
                var position = gesture.position;
                console.log("position: " + JSON.stringify(position));
                // g.append('circle')
                //     .attr('r', 20)
                //     .attr('cx', position[0])
                //     .attr('cy', position[1])
                //     .attr('fill', 'red')
                //     .attr('id', 'cursor');
                var circleOne = document.getElementById('circle1');
                simulateClick(circleOne);
            case "swipe":
                console.log("Swipe Gesture");
                break;
          }
      });
    }
  });