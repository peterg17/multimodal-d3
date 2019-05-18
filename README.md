# Multimodal D3.js
Final project for 6.835: Intelligent Multimodal User Interfaces
* multimodal interactions using gestures & speech for d3 visualizations


## Installing Dependencies & Running 
* Install Node&Npm [here](https://www.npmjs.com/get-npm)
* Install Leapmotion daemon [here](https://developer-archive.leapmotion.com/documentation/index.html)
* In one terminal:
    ```bash
        $ sudo leapd
    ```
* In a different terminal:
     ```bash
        $ npm install --save
        $ npm run server
     ```

This will run webpack, build your files in the dist/ folder, and start a python simple server. You can access the following visualizations by visiting the corresponding links in your browser:

----------------------------------------------------

Force-directed graph visualization:
http://localhost:8080/force.html

interact with this by 
* moving nodes with grab gesture
* if cursor intersects node can change color of node by saying "color red", "color green", "color blue"
* if cursor intersects node can remove node by saying "delete node"
* can reset colors of nodes by saying "reset nodes"

----------------------------------------------------

Scatter Graph pan+zoom visualization:
http://localhost:8080/scatterPan.html

interact with this by
* panning by making grab gesture and moving fist
* zooming in by holding hand at a location on screen and saying 'increase zoom'
* zooming out by holding hand at a location on screen and saying 'zoom out'

----------------------------------------------------

Scatter Graph gesture zoom visualization:
http://localhost:8080/scatterZoom.html

interact with this by
* zooming in by pointing at a location on screen and doing the Leap Motion built-in screenTap gesture
    * move finger forward and back as if ringing a doorbell
* zooming out by saying 'zoom out'

----------------------------------------------------

Put-that-there visualization:
http://localhost:8080/editor.html

interact with this by
* pointing to location on screen and say
    * "create" or "put"
    * a color "purple", "red", "blue" are the ones supported
    * "here"
    * e.g. - "put purple circle here"

----------------------------------------------------

MouseEvent emulator visualization:
http://localhost:8080/click.html

interact with this by
* pointing at a location on screen and doing the Leap Motion built-in screenTap gesture
    * if recognized this will show by triggering a MouseEvent that clicks on the top left circle and switches its color

----------------------------------------------------

## Files

| File Name                            | Purpose           |
| -------------                        | ------------- |
| package.json                         |  | 
| col 2 is                             | centered      | 
| zebra stripes                        | are neat      |

package.json - lists project settings and dependencies

webpack.config.js - has build settings for webpack, input files are in src/ and output files in dist/