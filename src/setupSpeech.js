import _ from 'lodash';
import main from './d3_main';

export default function speech () {
  var DEBUGSPEECH = true;
  console.log(main.processSpeech);
  var debouncedProcessSpeech = _.debounce(main.processSpeech, 500);
  
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
  
    // if (hasFinal)
    //   console.log("SPEECH DEBUG: ready");
    // else
    //   console.log("SPEECH DEBUG: " + transcript);
    
  
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
}

speech();

/*****************************************************************/
/******** END OF SPEECH RECOG SETUP ******************************/
/*****************************************************************/
