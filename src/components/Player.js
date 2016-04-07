import Camera from './Camera';
import Movie from './Movie';

/**
 * Class responsible of playing recorded data
 * @extends Camera
 */
export default class Player extends Camera {

  /**
   * Create player
   * @param {Object} opts Options
   * @param {HTMLElement} [opts.target] HTMLElement on which play data
   * @param {Object} [opts.onEvents={}] Define custom event callbacks for each event
   * @example
   * let player = new cimice.Player({
   *     target: document.getElementById('to-play'),
   *     onEvents: {
   *       'scroll': (player, frame) => {
   *         console.log('Override default scroll event callback');
   *        }
   *     }
   * });
   */
  constructor(opts = {}) {
    super(opts);
    if(opts.target)
      this.setTarget(opts.target);
    this.movie;
    this.currentFrame;
    this.displayer;
    this.isPlaying = false;
    this.initCursor();

    /**
     * Fires on movie play
     *
     * @event Player#play
     */
    this.on('play', () => {
      this.isPlaying = true;
    });

    /**
     * Fires on movie stop
     *
     * @event Player#stop
     */
    this.on('stop', () => {
      this.isPlaying = false;
      this.currentFrame = null;
    });

    /**
     * Fires on playing on every frame
     *
     * @event Player#playing
     * @property {Frame} frame Frame playing
     */
    this.on('playing', frame => {});
  }

  /**
   * Set movie containing frames to watch
   * @param {Movie} movie Movie to play
   * @returns {this}
   * @example
   * let movie = new cimice.Movie();
   * player.setMovie(movie);
   */
  setMovie(movie) {
    if(!(movie instanceof Movie))
      throw new Error('Target is not an instance of HTMLElement');
    this.movie = movie;
    return this;
  }

  /**
   * Play the movie
   * @returns {this}
   */
  play() {
    if(this.isPlaying)
      return;

    let movie = this.tryGetMovie();
    this.initTarget();
    this.getDisplayer();
    this.target.appendChild(this.cursor);

    let frames = movie.frames;
    this.emit('play');
    if(frames.length)
      this.playFrom(frames[0]);
    else
      this.stop();

    return this;
  }

  /**
   * Stop the movie if it's playing
   * @returns {this}
   */
  stop() {
    this.emit('stop');
    return this;
  }

  /**
   * Return cursor element
   * @returns {HTMLElement}
   */
  getCursor(){
    return this.cursor;
  }

  /**
   * Return cursor horizontal position, expressed in pixels
   * @param {Frame|null} frame Frame on which get position, in case of null will use current frame
   * @returns {number}
   */
  getCursorX(frame){
    let f = frame || this.currentFrame;
    let tr = this.tryGetTarget();
    let mLeft = this.tryGetMovie().left;
    let scrollLeft = mLeft === 0 ? f.scrollX : tr.scrollLeft;
    let x = f.cursorX - mLeft + scrollLeft;
    return x;
  }

  /**
   * Return cursor vertical position, expressed in pixels
   * @param {Frame|null} frame Frame on which get position, in case of null will use current frame
   * @returns {number}
   */
  getCursorY(frame){
    let f = frame || this.currentFrame;
    let tr = this.tryGetTarget();
    let mTop = this.tryGetMovie().top;
    let scrollTop = mTop === 0 ? f.scrollY : tr.scrollTop;
    let y = f.cursorY - mTop + scrollTop;
    return y;
  }

  /**
   * Generate an iframe, if not yet created, and push the decoded scene from the movie
   * @return {HTMLElement} iframe element
   * @private
   */
  getDisplayer() {
    if(!this.displayer){
      this.displayer = document.createElement("iframe");
      this.tryGetTarget().appendChild(this.displayer);
      this.displayer.style = 'height:100%;width:100%;border:none';
    }
    let displayerWindow = this.displayer.contentWindow.document;
    let movie = this.tryGetMovie();
    displayerWindow.body.innerHTML = movie.getDecodedScene();
    displayerWindow.body.style = 'margin:0; overflow:hidden';

    this.target = displayerWindow.body;
    this.target.scrollTop = movie.scrollY;
    this.target.scrollLeft = movie.scrollX;
    return this.displayer;
  }

  /**
   * Get movie and throws error in case is empty
   * @returns {Movie} movie
   * @private
   */
  tryGetMovie() {
    let movie = this.movie;

    if(!movie)
      throw new Error('Movie not found');

    return movie;
  }

  /**
   * Create and return a cursor element
   * @return {HTMLElement} HTMLElement cursor element
   * @private
   */
  initCursor() {
    let cursor = document.createElement("div");
    cursor.id = 'cursor';
    cursor.style.position = 'absolute';
    cursor.style.zIndex = '1';
    cursor.style.width = '11px';
    cursor.style.height = '18px';
    cursor.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 934" style="height:100%;width:100%"><path d="M0 0l512 510.2 -201.8 32.9L480.4 852.1l-153.9 81.9L154.2 622.1 0 776.3V0z" style="fill:#000;stroke-width:3em;stroke:#fff;"/></svg>`;
    this.cursor = cursor;
    return this.cursor;
  }

  /**
   * Clean target, add cursor and set the necessary parameters
   * @returns {this}
   * @private
   */
  initTarget() {
    let target = this.tryGetTarget();

    while (target.firstChild)
      target.removeChild(target.firstChild);

    target.style.position = 'relative';
    return this;
  }

  /**
   * Start playing from a specific frame
   * @param {Frame} frame Frame from which start to play
   * @private
   */
  playFrom(frame) {
    let movie = this.tryGetMovie();
    let index = movie.frames.indexOf(frame);
    let nextFrame = movie.frames[index + 1];
    let event = frame.eventType;
    let callback = this.onEvents[event] || this.abstractOnEvent;
    this.currentFrame = frame;
    this.emit('playing', frame);
    this.emit(frame.eventType, frame);
    callback(this, frame);
    if(nextFrame && this.isPlaying){
      let wait = nextFrame.ts - frame.ts;
      setTimeout(() => {
          this.playFrom(nextFrame);
      }, wait);
    }else
      this.stop();
  }

  /**
   * Abstract callback on generic event play
   * @param {Player} player Player caller
   * @param {Frame} frame Called frame
   * @private
   */
  abstractOnEvent(player, frame) {
    let target = player.target;
    let movie = player.movie;
    let u = 'px';

    let scrollTop = movie.top === 0 ? frame.scrollY : target.scrollTop;
    let scrollLeft = movie.left === 0 ? frame.scrollX : target.scrollLeft;

    if(frame.eventType === 'scroll'){
      target.scrollTop = frame.scrollY;
      target.scrollLeft = frame.scrollX;
    }

    if(frame.width){
       target.style.width = frame.width + u;
       player.displayer.style.width = frame.width + u;
    }
    if(frame.height){
       target.style.height = frame.height + 'px';
       player.displayer.style.height = frame.height + u;
    }

    let pX = frame.cursorX - movie.left + scrollLeft;
    let py = frame.cursorY - movie.top + scrollTop;

    player.cursor.style.left = pX + u;
    player.cursor.style.top = py + u;
  }

  /**
   * Default event callbacks
   * @return {Objet}
   * @private
   */
  onEvents() {
    return {
      click: (player, frame) => {
        let target = player.target;
        let scrollTop = player.movie.top === 0 ? frame.scrollY : target.scrollTop;
        let scrollLeft = player.movie.left === 0 ? frame.scrollX : target.scrollLeft;
        let dot = document.createElement("div");
        dot.className = 'dotClick';

        let pX = frame.cursorX - player.movie.left + scrollLeft;
        let py = frame.cursorY - player.movie.top + scrollTop;
        dot.style.backgroundColor = '#f04242';
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.borderRadius = '100%';
        dot.style.boxShadow = '0 0 3px #d92b2b';
        dot.style.marginLeft = '-5px';
        dot.style.marginTop = '-5px';
        dot.style.position = 'absolute';
        dot.style.left = pX + 'px';
        dot.style.top = py + 'px';

        target.appendChild(dot);
      },
    };
  }
}