$(document).ready(function(){

  var recorder = new cimice.Recorder({
    target: document.getElementById('to-rec')
  });

  var btnRec = document.getElementById('rec');
  btnRec.addEventListener('click', function(){
    var active = (" " + btnRec.className + " ").indexOf(" active ") > -1;
    if(active){
      recorder.stopRecording();
      btnRec.className = btnRec.className.replace(/\bactive\b/,'');
    }else{
      recorder.startRecording();
      btnRec.className += " active";
    }
  });

  recorder.on('recording', function(e){
    console.log('clicked '+ e.type);
  });

})