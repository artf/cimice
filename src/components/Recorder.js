import Camera from './Camera';
import Movie from './Movie';
import {Base64} from 'js-base64';

/**
 * Class responsible for recording
 * @extends Camera
 */
export default class Recorder extends Camera {

  /**
   * Create recorder
   * @param {Object} opts Options
   * @param {HTMLElement} [opts.target] HTMLElement on which track all events
   * @param {Object} [opts.onEvents={}] Define custom event callbacks for each event
   * @param {Array<string>} [opts.events=['mousemove', 'click', 'scroll', 'resize']] Events to track
   * @example
   * let recorder = new cimice.Recorder({
   *     target: document.getElementById('to-rec'),
   *     events: ['mousemove', 'scroll'],
   *     onEvents: {
   *       'scroll': (recorder, movie, e) => {
   *         console.log('Override default scroll event callback');
   *        }
   *     }
   * });
   */
  constructor(opts = {}) {
    super(opts);
    if(opts.target)
      this.setTarget(opts.target);
    this.events = opts.events || ['mousemove', 'click', 'scroll', 'resize'];
    this.eventHandlers = [];
    this.movie;
    this.isRecording = false;

    // Basically events are binded to the target but unfortunately not all of them
    // are easily bindable so there is a need to have a way to indicate custom listeners.
    // At the moment I will let this property private
    this.listeners = opts.listeners || {};

    // Hard-coded listeners
    if(this.target instanceof window.HTMLHtmlElement)
      this.listeners = {'scroll': window, 'resize': window};

    /**
     * Fires when start recording
     *
     * @event Recorder#startRecording
     */
    this.on('startRecording', () => {
      this.isRecording = true;
    });

    /**
     * Fires when stop recording
     *
     * @event Recorder#stopRecording
     */
    this.on('stopRecording', () => {
      this.isRecording = false;
    });

    /**
     * Fires on recording of every event
     *
     * @event Recorder#recording
     * @property {Event} e Event object
     */
    this.on('recording', e => {});
  }

  /**
   * Get recorded movie
   * @returns {Movie}
   */
  getMovie() {
    return this.movie;
  }

  /**
   * Returns the array of events that will be binded to the target
   * @returns {Array<string>} Events
   */
  getEvents(){
    return this.events;
  }

  /**
   * Set an array of events that will be binded to the target. This method
   * overrides the previous set of events.
   * @param {string|Array<string>} events Event or array of events
   * @returns {this}
   * @example
   * recorder.setEvents('resize');
   * console.log(recorder.getEvents());
   * // -> ['resize']
   * recorder.setEvents(['click','mousemove','scroll']);
   * console.log(recorder.getEvents());
   * // -> ['click','mousemove','scroll']
   */
  setEvents(events){
    let e = [].concat(events || []);
    this.events = [];
    for (let i = 0; i < e.length; i++) {
      this.events.push(e[i]);
    }
    return this;
  }

  /**
   * Returns custom listeners
   * @return {Object} listeners
   * @private
   */
  getListeners() {
    return this.listeners;
  }

  /**
   * Get listener by event, returns target in case there is no one
   * @param {string} event Event, eg. 'scroll', 'click'
   * @return {Object} listener
   * @private
   */
  getListener(event) {
    return this.listeners[event] || this.tryGetTarget();
  }

  /**
   * Create a new movie and set parameters about a target
   * @returns {Movie} Created movie
   * @private
   */
  initMovie(){
    let target = this.tryGetTarget();
    let movie = new Movie();
    let targetPos = this.getPosTarget();
    movie.top = targetPos.top;
    movie.left = targetPos.left;
    movie.scene = Base64.encode(target.cloneNode(true).innerHTML);
    movie.scrollX = target.scrollLeft;
    movie.scrollY = target.scrollTop;
    this.movie = movie;
    return this.movie;
  }

  /**
   * Get top and left position of the target
   * @returns {Object} An object with position data, eg. {top: 100, left: 100}
   * @private
   */
  getPosTarget() {
    let rect = this.tryGetTarget().getBoundingClientRect();
    let docEl = document.documentElement;
    return {
      top: rect.top + (window.pageYOffset || docEl.scrollTop || 0),
      left: rect.left + (window.pageXOffset || docEl.scrollLeft || 0)
    };
  }

  /**
   * Bind all events to the target and start recording
   */
  startRecording() {
    this.initMovie();
    this.emit('startRecording');

    for (let i = 0; i < this.events.length; i++) {
      let event = this.events[i];
      let callback = this.onEvents[event];

      if(!callback)
        callback = this.abstractEventCallback;

      let handler = (e) => { this.onEventCallback(callback, e); };
      this.eventHandlers.splice(i, 0, handler);

      this.getListener(event).addEventListener(event, handler);
    }
  }

  /**
   * Unbind all events and return recorded data
   * @returns {Movie} Recorded movie
   */
  stopRecording() {
    for (let i = 0; i < this.events.length; i++) {
      let event = this.events[i];
      let handler = this.eventHandlers[i];

      if(handler)
        this.getListener(event).removeEventListener(event, handler);
    }
    this.emit('stopRecording');
    return this.movie;
  }

  /**
   * Method called on any triggered event
   * @param  {Function} callback Callback to use on trigger
   * @param  {Event} event Event object
   * @private
   */
  onEventCallback(callback, event){
    this.emit('recording', event);
    this.emit(event.type, event);
    callback(this, this.movie, event);
  }

  /**
   * Abstract callback on generic event
   * @private
   */
  abstractEventCallback(recorder, movie, e){
    let t = e.target;
    let b = t.body;
    let scrollTop = b ? (b.parentNode.scrollTop || b.scrollTop) : t.scrollTop;
    let scrollLeft = b ? (b.parentNode.scrollLeft || b.scrollLeft) : t.scrollLeft;
    movie.addFrame({
      scrollY: scrollTop,
      scrollX: scrollLeft,
      cursorX: e.pageX,
      cursorY: e.pageY,
      width: recorder.target.clientWidth,
      height: recorder.target.clientHeight,
      eventType: e.type,
    });
  }


}