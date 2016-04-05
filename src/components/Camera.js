import { EventEmitter } from 'events';

/**
 * Base class
 * @private
 */
export default class Camera extends EventEmitter{

  constructor(opts = {}) {
    super();
    this.onEvents = opts.onEvents || this.onEvents();
    this.target;
  }

  /**
   * Returns a list of callbacks for each event
   * @private
   */
  onEvents(){
    return {};
  }

  /**
   * Set target
   * @param {HTMLElement} target Any HTML element
   */
  setTarget(target) {
    if(!(target instanceof window.HTMLElement))
      throw new Error('Target is not an instance of HTMLElement');
    this.target = target;
    return this;
  }

  /**
   * Returns target
   * @return {HTMLElement} HTML element
   */
  getTarget() {
    return this.target;
  }

  /**
   * Get target and throw the error in case is empty
   * @returns {HTMLElement} target HTML element
   * @private
   */
  tryGetTarget(){
    let target = this.getTarget();

    if(!target)
      throw new Error('Target not found');

    return target;
  }

}