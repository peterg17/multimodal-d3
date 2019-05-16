
import * as d3 from 'd3';
import * as Leap from 'leapjs';
import 'leapjs-plugins';
import './zoom.css';
import _ from 'lodash';


var margin = { top: 20, right: 20, bottom: 30, left: 30 };
var width = 960 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var svg = d3.select('svg');
var innerDisplay = svg.append("g");

var generateSpeech = function(message, callback) {
    if (voicesReady) {
      var msg = new SpeechSynthesisUtterance();
      msg.voice = window.speechSynthesis.getVoices()[VOICEINDEX];
      msg.text = message;
      msg.rate = 0.2;
      if (typeof callback !== "undefined")
        msg.onend = callback;
      speechSynthesis.speak(msg);
    }
};

var scatterPosition = [0,0];
var normalizedPosition = [0,0,0];
var isGrabbing = false;
var intersectObj = false;
var currPosition = [width/2, height/2];
var dragCount = 0;

var controller = Leap.loop({enableGestures: true}, function(frame){
    svg.select('#cursor').remove();        
    
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
            currPosition = scatterPosition;
            scatterPosition = [normalizedPosition[0] * width, normalizedPosition[1] * height];
                        
            innerDisplay.append('circle')
                        .attr('r', 20)
                        .attr('cx', scatterPosition[0])
                        .attr('cy', scatterPosition[1])
                        .attr('fill', 'red')
                        .attr('opacity', 0.5)
                        .attr('id', 'cursor');

            if (hand.grabStrength >= 0.95 || hand.pinchStrength >= 0.95) { // can change this threshold
                // fill in moving logic for shapes
                if (isGrabbing == true && intersectObj != false) {
                    var diffVector = [scatterPosition[0] - currPosition[0], scatterPosition[1] - currPosition[1]];
                    intersectObj.attr("transform", "translate(" + diffVector[0] + "," + diffVector[1] + ")" );
                }
                isGrabbing = true;
            } else {
                isGrabbing = false;
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

    if (userSaid(transcript, ['create']) || userSaid(transcript, ['put'])) {
        var color = "blue";
        if (userSaid(transcript, ['blue'])) {
            color = "blue";
        } else if (userSaid(transcript, ['red'])) {
            color = "red";
        } else if (userSaid(transcript, ['purple'])) {
            color = "purple";
        }
        if (userSaid(transcript, ['circle'])) {
            
            innerDisplay
                .append('circle')
                .attr('class', 'object')
                .attr('cx', scatterPosition[0])
                .attr('cy', scatterPosition[1])
                .attr('r', 40)
                .attr('fill', color);
        } else if (userSaid(transcript, ['triangle'])) {
            
            svg.append('path')
            .attr('d', function(d) { 
                return 'M ' + scatterPosition[0] +' '+ scatterPosition[1] + ' l 40 40 l -80 0 z';
            })
            .attr('fill', color);
        }
    } else if (userSaid(transcript, ['select'])) {
        svg.selectAll("circle").each(function(d) {
            console.log("object:");
            console.log(d);
            var x = d.cx;
            var y = d.cy;
            // console.log("james is tired");
            // console.log(x,y);
            var bound = 30;
            var bbox = {
                x1: x-bound,
                x2: x+bound,
                y1: y-bound,
                y2: y+bound,
            };
            // console.log("after second use of x");
            // console.log("bbox: " + JSON.stringify(bbox));
            // console.log("cursor pos: " + cursorPosition);
            if (bbox.x1 <= scatterPosition[0] && bbox.x2 >= scatterPosition[0]
              && bbox.y1 <= scatterPosition[1] && bbox.y2 >= scatterPosition[1]) {
                intersectObj = d;
                d.attr('fill', 'black');
            }
        });
    } else if (userSaid(transcript, ['drop'])) {
        intersectObj.attr('fill', 'blue');
        intersectObj = false;
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
