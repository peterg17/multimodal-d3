import * as d3 from 'd3';
import * as Leap from 'leapjs';
import 'leapjs-plugins';
import './scatter.css';


var svg = d3.select("svg");

svg.append('rect')
    .attr('height', 250)
    .attr('id', 'outline')
    .attr('width', 250)
    .attr('stroke', 'black')
    .attr('stroke-width', 4)
    .attr('opacity', 0.25)
    .attr('fill-opacity', 0.0)
    .attr('class', 'border-rect');

var outline = d3.select('#outline');
var x0 = outline.x0;
var y0 = outline.y0;

d3.select('#outline')
    .append('circle')
        .attr('r', 10)
        .attr('cx', 10)
        .attR('cy', 10);

var controller = Leap.loop({enableGestures: true}, function(frame){
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
                console.log("Screen Tap Gesture");
                break;
            case "swipe":
                console.log("Swipe Gesture");
                break;
          }
      });
    }
  });