/**
 * Class representing a single frame
 */
export default class Frame {

  constructor(opts = {}) {
    this.eventType = opts.eventType || '';
    this.options = opts.options || {};
    this.cursorX = opts.cursorX || 0;
    this.cursorY = opts.cursorY || 0;
    this.height = opts.height;
    this.width = opts.width;
    this.ts = opts.ts || 0;
  }

}