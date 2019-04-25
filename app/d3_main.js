var VOICEINDEX = 17; // UK British Female
var DEBUGSPEECH = true;
var LEAPSCALE = 0.6;
var Surface = famous.core.Surface;

var otherFeedback = new Surface({
  content: "",
  size: [undefined, 50],
  properties: {
    backgroundColor: "white",
    color: "black"
  }
});
var nodes = [
    { id: "mammal", group: 0, label: "Mammals", level: 1 },
    { id: "dog"   , group: 0, label: "Dogs"   , level: 2 },
    { id: "cat"   , group: 0, label: "Cats"   , level: 2 },
    { id: "fox"   , group: 0, label: "Foxes"  , level: 2 },
    { id: "elk"   , group: 0, label: "Elk"    , level: 2 },
    { id: "insect", group: 1, label: "Insects", level: 1 },
    { id: "ant"   , group: 1, label: "Ants"   , level: 2 },
    { id: "bee"   , group: 1, label: "Bees"   , level: 2 },
    { id: "fish"  , group: 2, label: "Fish"   , level: 1 },
    { id: "carp"  , group: 2, label: "Carp"   , level: 2 },
    { id: "pike"  , group: 2, label: "Pikes"  , level: 2 }
  ]
  var links = [
    { target: "mammal", source: "dog" , strength: 0.1 },
    { target: "mammal", source: "cat" , strength: 0.1 },
    { target: "mammal", source: "fox" , strength: 0.1 },
    { target: "mammal", source: "elk" , strength: 0.1 },
    { target: "insect", source: "ant" , strength: 0.1 },
    { target: "insect", source: "bee" , strength: 0.1 },
    { target: "fish"  , source: "carp", strength: 0.1 },
    { target: "fish"  , source: "pike", strength: 0.1 },
    { target: "cat"   , source: "elk" , strength: 0.1 },
    { target: "carp"  , source: "ant" , strength: 0.1 },
    { target: "elk"   , source: "bee" , strength: 0.1 },
    { target: "dog"   , source: "cat" , strength: 0.1 },
    { target: "fox"   , source: "ant" , strength: 0.1 },
      { target: "pike"  , source: "cat" , strength: 0.1 }
  ]

  var voicesReady = false;
  window.speechSynthesis.onvoiceschanged = function() {
    voicesReady = true;
    // Uncomment to see a list of voices
    //console.log("Choose a voice:\n" + window.speechSynthesis.getVoices().map(function(v,i) { return i + ": " + v.name; }).join("\n"));
  };

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
    
  function getNeighbors(node) {
    return links.reduce(function (neighbors, link) {
        if (link.target.id === node.id) {
          neighbors.push(link.source.id)
        } else if (link.source.id === node.id) {
          neighbors.push(link.target.id)
        }
        return neighbors
      },
      [node.id]
    )
  }
  function isNeighborLink(node, link) {
    return link.target.id === node.id || link.source.id === node.id
  }
  function getNodeColor(node, neighbors) {
    if (Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1) {
      return node.level === 1 ? 'blue' : 'green'
    }
    return node.level === 1 ? 'gray' : 'gray'
  }
  function getLinkColor(node, link) {
    return isNeighborLink(node, link) ? 'green' : '#E5E5E5'
  }
  function getTextColor(node, neighbors) {
    return Array.isArray(neighbors) && neighbors.indexOf(node.id) > -1 ? 'green' : 'black'
  }
  var width = window.innerWidth
  var height = window.innerHeight
  var svg = d3.select('svg')
  svg.attr('width', width).attr('height', height)
  // simulation setup with all forces
  var linkForce = d3
    .forceLink()
    .id(function (link) { return link.id })
    .strength(function (link) { return link.strength })
  var simulation = d3
    .forceSimulation()
    .force('link', linkForce)
    .force('charge', d3.forceManyBody().strength(-120))
    .force('center', d3.forceCenter(width / 2, height / 2))
  var dragDrop = d3.drag().on('start', function (node) {
    node.fx = node.x
    node.fy = node.y
  }).on('drag', function (node) {
    simulation.alphaTarget(0.4).restart()
    node.fx = d3.event.x
    node.fy = d3.event.y
  }).on('end', function (node) {
    if (!d3.event.active) {
      simulation.alphaTarget(0)
    }
    node.fx = null
    node.fy = null
  })
  function selectNode(selectedNode) {
    var neighbors = getNeighbors(selectedNode)
    // we modify the styles to highlight selected nodes
    nodeElements.attr('fill', function (node) { return getNodeColor(node, neighbors) })
    // textElements.attr('fill', function (node) { return getTextColor(node, neighbors) })
    linkElements.attr('stroke', function (link) { return getLinkColor(selectedNode, link) })
  }
  var linkElements = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter().append("line")
      .attr("stroke-width", 5)
        .attr("stroke", "rgba(50, 50, 50, 0.2)")
  var nodeElements = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", 30)
      .attr("fill", getNodeColor)
      .call(dragDrop)
      .on('click', selectNode)
  // var textElements = svg.append("g")
  //   .attr("class", "texts")
  //   .selectAll("text")
  //   .data(nodes)
  //   .enter().append("text")
  //     .text(function (node) { return  node.label })
  // 	  .attr("font-size", 15)
  // 	  .attr("dx", 15)
  //     .attr("dy", 4)
  simulation.nodes(nodes).on('tick', () => {
    nodeElements
      .attr('cx', function (node) { return node.x })
      .attr('cy', function (node) { return node.y })
    // textElements
    //   .attr('x', function (node) { return node.x })
    //   .attr('y', function (node) { return node.y })
    linkElements
      .attr('x1', function (link) { return link.source.x })
      .attr('y1', function (link) { return link.source.y })
      .attr('x2', function (link) { return link.target.x })
      .attr('y2', function (link) { return link.target.y })
  })
  simulation.force("link").links(links)


var isGrabbing = false;
var cursorPosition = [0,0];
var screenPosition = [0,0];
var intersectNode = false;
var initialPosition = false;

var ctz = 0;
Leap.loop({ hand: function(hand) {
  d3.select('#cursor').remove();
  
  screenPosition = hand.screenPosition();
  cursorPosition = [screenPosition[0], screenPosition[1]+300];
  
  d3.select('svg')
          .append('circle')
          .attr('id', 'cursor')
          .attr('cx', cursorPosition[0])
          .attr('cy', cursorPosition[1])
          .attr('fill', 'blue')
          .attr('r', 20);

  	if (hand.grabStrength >= 0.95 || hand.pinchStrength >= 0.95) { // can change this threshold
      isGrabbing = true;
    } else {
      isGrabbing = false;
    } 
    if (isGrabbing) {
       // if (ctz < 1) {
          // d3.select('circle').call(drag());
        // console.log(nodes[0].x);
        // // nodes[0].x = nodes[0].x + 200;
        // console.log('cursor pos: ' + cursorPosition);
        // var curr_nodes = $('.');
        // console.log("current nodes: " + JSON.stringify(curr_nodes));
        // curr_nodes.each(function (node) {
        //   console.log("node: " + node);
        // });
        // console.log("grabbing");
        
        if (intersectNode != false) {
          simulation.alphaTarget(0.4).restart()
          intersectNode.x = cursorPosition[0];
          intersectNode.y = cursorPosition[1];
        }
        

        if (intersectNode == false){
          d3.selectAll('circle').each(function(d) {
            // Logs the cx and cy attributes of a node.
              if (d3.select(this).attr('id') != 'cursor') {
                // x = d3.select(this).attr('cx')
                // y = d3.select(this).attr('cy')
                x = d.x;
                y = d.y;
                // console.log("james is tired");
                // console.log(x,y);
                var bound = 30;
                var bbox = {
                    x1: x-bound,
                    x2: x+bound,
                    y1: y-bound,
                    y2: y+bound,
                };
                // console.log("bbox: " + JSON.stringify(bbox));
                // console.log("cursor pos: " + cursorPosition);
                if (bbox.x1 <= cursorPosition[0] && bbox.x2 >= cursorPosition[0]
                  && bbox.y1 <= cursorPosition[1] && bbox.y2 >= cursorPosition[1]) {
                    initialPosition = [x, y];
                    intersectNode = d;
                    d3.select(this).attr('fill', 'black');
                    console.log("intersects");
                }
              }
            });
          }

        // ctz += 1;
        // console.log("after for loop");
    } else {
      // console.log("in else statement");
      if (intersectNode != false) {
        d3.selectAll('circle').each(function(node) {
          if (d3.select(this).attr('id') != 'cursor') {
            if (node.id == intersectNode.id) {
              d3.select(this).attr('fill', 'gray');
            }
          }
        }); 
        intersectNode = false;
        simulation.restart();
      }
    }
    // intersectNode.y = initialPosition[1];
    console.log("insersect node is: " + JSON.stringify(intersectNode));
}}).use('screenPosition', {scale: LEAPSCALE});

// var colors = new Set(["blue","red","green",]);
var processSpeech = function(transcript) {
//   // Helper function to detect if any commands appear in a string
  var userSaid = function(str, commands) {
    var lowercaseStr = str.toLowerCase();
    for (var i = 0; i < commands.length; i++) {
      if (lowercaseStr.indexOf(commands[i]) > -1)
        return commands[i];
    }
    return false;
  };

  var processed = false;
    // Detect the 'start' command, and start the game if it was said
  var deletion = userSaid(transcript, ['delete'])
  if (deletion) {
    d3.selectAll('circle').each(function(d) {
    // Logs the cx and cy attributes of a node.
      if (d3.select(this).attr('id') != 'cursor') {
        // x = d3.select(this).attr('cx')
        // y = d3.select(this).attr('cy')
        x = d.x;
        y = d.y;
        // console.log("james is tired");
        // console.log(x,y);
        var bound = 30;
        var bbox = {
            x1: x-bound,
            x2: x+bound,
            y1: y-bound,
            y2: y+bound,
        };
        // console.log("bbox: " + JSON.stringify(bbox));
        // console.log("cursor pos: " + cursorPosition);
        if (bbox.x1 <= cursorPosition[0] && bbox.x2 >= cursorPosition[0]
          && bbox.y1 <= cursorPosition[1] && bbox.y2 >= cursorPosition[1]) {
            d3.select(this).remove();
        }
      }
    });
    processed = true;
  }

  var changeColor = userSaid(transcript, ["blue","red","green"])

  if (changeColor) {
    d3.selectAll('circle').each(function(d) {
    // Logs the cx and cy attributes of a node.
      if (d3.select(this).attr('id') != 'cursor') {
        // x = d3.select(this).attr('cx')
        // y = d3.select(this).attr('cy')
        x = d.x;
        y = d.y;
        // console.log("james is tired");
        // console.log(x,y);
        var bound = 30;
        var bbox = {
            x1: x-bound,
            x2: x+bound,
            y1: y-bound,
            y2: y+bound,
        };
        // console.log("bbox: " + JSON.stringify(bbox));
        // console.log("cursor pos: " + cursorPosition);
        if (bbox.x1 <= cursorPosition[0] && bbox.x2 >= cursorPosition[0]
          && bbox.y1 <= cursorPosition[1] && bbox.y2 >= cursorPosition[1]) {
            d3.select(this).attr('fill', changeColor);
        }
      }
    });
    console.log()
    processed = true;
  }
  
  // place the ships in a better wa

  return processed;
};