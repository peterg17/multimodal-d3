
/*
if (grab)
    find node by cursor position
        write function to intersect coordinate with node
    start drag with selected object


*/
setupUserInterface();
var cursor = new Cursor();
var isGrabbing = false;
var cursorPosition = [0,0];

Leap.loop({ hand: function(hand) {
	cursorPosition = hand.screenPosition();
  	cursorPosition[1] = cursorPosition[1]
  	if (hand.grabStrength >= 0.95 || hand.pinchStrength >= 0.95) { // can change this threshold
      isGrabbing = true;
    } else {
      isGrabbing = false;
    } 
    if (isGrab) {
    	
    }   
}}).use('screenPosition', {scale: LEAPSCALE});
