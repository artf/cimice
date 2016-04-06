import Frame from './Frame';
import {Base64} from 'js-base64';

/**
 * Class containing recorded frames
 */
export default class Movie {

  /**
   * Create movie
   * @param {Object} opts Options
   * @param {Array<Frame|Object>} [opts.frames=[]] Array of frames
   * @param {number} [opts.top=0] Top position of the movie, relative to document
   * @param {number} [opts.left=0] Left position of the movie, relative to document
   * @param {number} [opts.scrollX=0] The initial horizontal scroll position inside player target
   * @param {number} [opts.scrollY=0] The initial vertical scroll position inside player target
   * @param {string} [opts.scene=''] Base64 encoded HTML string
   * @example
   * let frame = new cimice.Frame({eventType: 'click'});
   * let movie = new cimice.Movie({
   *     top: 100,
   *     left: 100,
   *     scene: 'SGFja2VyIERldGVjdGVkIQ==',
   *     frames: [
   *       {eventType: 'click'},
   *       frame,
   *       {eventType: 'mousemove'}
   *     ],
   * });
   */
  constructor(opts = {}) {
    this.top = opts.top || 0;
    this.left = opts.left || 0;
    this.scrollX = opts.scrollX || 0;
    this.scrollY = opts.scrollY || 0;
    this.scene = opts.scene || '';
    this.frames = [];
    let frames = opts.frames || [];

    for(let i = 0; i < frames.length; i++) {
      this.addFrame(new Frame(frames[i]));
    }
  }

  /**
   * Add new frame to the collection. If the object passed is an instance of Frame
   * it will added as it is, in case of simple object will create a new Frame
   * and set actual timestamp.
   * @param {Frame|Object} frame Frame instance or object
   * @returns {Frame|undefined} Added frame
   * @example
   * let frame1 = movie.addFrame({eventType: 'click'});
   * // Or
   * let frame = new cimice.Frame({eventType: 'click'});
   * let frame2 = movie.addFrame(frame);
   */
  addFrame(frame = {}) {
    let result;

    if(frame instanceof Frame ){
      result = frame;
    }else if(frame !== null && typeof frame === 'object'){
      result = new Frame(frame);
      let d = new Date();
      result.ts = d.getTime();
    }

    if(result){
      this.frames.push(result);
      return result;
    }
  }

  /**
   * Get the collection of frames
   * @returns {Array<Frame>} Array of frames
   */
  getFrames() {
    return this.frames;
  }

  /**
   * Returns movie and related frames in JSON format. Generally coulde be used to extract data
   * during the recording and send back to server
   * @returns {string} JSON data
   * @example
   * var json = JSON.stringify(movie);
   * var xhr = new XMLHttpRequest();
   * xhr.open('POST', url);
   * xhr.send(json);
   */
  toJSON(){
    return {
      top: this.top,
      left: this.left,
      scrollX: this.scrollX,
      scrollY: this.scrollY,
      scene: this.scene,
      frames: this.frames,
    };
  }

  /**
   * Decode and cache base64 encoded scene
   * @return {string} Decoded scene
   * @private
   */
  getDecodedScene(){
    if(!this.sceneDecoded)
      this.sceneDecoded = Base64.decode(this.scene);
    return this.sceneDecoded;
  }
}