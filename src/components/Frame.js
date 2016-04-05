/**
 * Class representing a single frame
 */
export default class Frame {

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