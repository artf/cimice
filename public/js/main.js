$(document).ready(function(){
  var $header = $('header');
  var viewportH = $(window).height();
  var $root = $('html, body');
  $header.css('min-height', viewportH);

  // highlight.js init
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  $('.scroll-link').click(function() {
    var target = $($.attr(this, 'data-target'));
    if( target.length ){
        $root.animate({
            scrollTop: (target.offset().top -70 )
        }, 500);
        return false;
    }
  });

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