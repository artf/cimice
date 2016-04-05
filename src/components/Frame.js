/**
 * Class representing a single frame
 */
export default class Frame {

  /**
   * Create a frame
   * @param {Object} opts Options
   * @param {number} [opts.cursorX=0] X cursor position, in pixels
   * @param {number} [opts.cursorY=0] Y cursor position, in pixels
   * @param {number} [opts.scrollX=0] X scroll length, in pixels
   * @param {number} [opts.height=0] Height of the frame, in pixels
   * @param {number} [opts.width=0] Width of the frame, in pixels
   * @param {number} [opts.ts=0] Timestamp of the frame
   * @param {Object} [opts.options={}] Custom options
   * @param {string} [opts.eventType=''] Event type, eg. 'click', 'mousemove'
   * @example
   * let frame = new cimice.Frame({
   *     eventType: 'click',
   *     cursorX: 100,
   *     cursorY: 100,
   *     options: { customProp: 'customValue' }
   * });
   */
  constructor(opts = {}) {
    this.eventType = opts.eventType || '';
    this.options = opts.options || {};
    this.scrollX = opts.scrollX || 0;
    this.scrollY = opts.scrollY || 0;
    this.cursorX = opts.cursorX || 0;
    this.cursorY = opts.cursorY || 0;
    this.height = opts.height;
    this.width = opts.width;
    this.ts = opts.ts || 0;
  }

  /**
   * Returns frame in JSON format
   * @return {string} String in JSON format
   * @example
   * let frame = new cimice.Frame({
   *     eventType: 'click',
   *     cursorX: 100,
   *     cursorY: 100,
   * });
   * console.log(JSON.stringify(frame));
   */
  toJSON() {
    return {
        eventType: this.eventType,
        options: this.options,
        scrollX: this.scrollX,
        scrollY: this.scrollY,
        cursorX: this.cursorX,
        cursorY: this.cursorY,
        height: this.height,
        width: this.width,
        ts: this.ts,
    };
  }

}