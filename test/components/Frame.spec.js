import {expect} from 'chai';
import Frame from '../../src/components/Frame.js';

describe('Frame', () => {
  let frame;

  beforeEach(() => {
    frame = new Frame({
      options: { customProp: 'customValue' },
      eventType: 'click',
      cursorX: 1,
      cursorY: 2,
      height: 5,
      width: 6,
      ts: 7,
    });
  });

  it('EventType is correct', () => {
    expect(frame.eventType).to.equal('click');
  });

  it('CursorX is correct', () => {
    expect(frame.cursorX).to.equal(1);
  });

  it('CursorY is correct', () => {
    expect(frame.cursorY).to.equal(2);
  });

  it('Height is correct', () => {
    expect(frame.height).to.equal(5);
  });

  it('Width is correct', () => {
    expect(frame.width).to.equal(6);
  });

  it('Timestamp is correct', () => {
    expect(frame.ts).to.equal(7);
  });

})