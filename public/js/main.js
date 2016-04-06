$(document).ready(function(){

  // Recording
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

  // Playing
  var player = new cimice.Player({
    target: document.getElementById('to-view')
  });

  var btnPlay = document.getElementById('play');
  var btnStop = document.getElementById('stop');

  btnStop.addEventListener('click', function(){
    player.stop();
  });

  btnPlay.addEventListener('click', function(){
    player.setMovie(recorder.getMovie());
    player.play();
  });

  player.on('play',function(){
    btnPlay.className += " active";
  });

  player.on('stop',function(){
    btnPlay.className = btnPlay.className.replace(/\bactive\b/,'');
  });

})