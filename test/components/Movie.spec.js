import {expect} from 'chai';
import Frame from '../../src/components/Frame.js';
import Movie from '../../src/components/Movie.js';

describe('Movie', () => {
  let movie;

  beforeEach(() => {
    movie = new Movie();
  });

  it('Top is correct', () => {
    expect(movie.top).to.equal(0);
  });

  it('Left is correct', () => {
    expect(movie.left).to.equal(0);
  });

  it('ScrollX is correct', () => {
    expect(movie.scrollX).to.equal(0);
  });

  it('ScrollY is correct', () => {
    expect(movie.scrollY).to.equal(0);
  });

  it('Frames are correct', () => {
    expect(movie.getFrames().length).to.equal(0);
  });

  it('Add frame as an object', () => {
    movie.addFrame({eventType: 'click'});
    expect(movie.getFrames().length).to.equal(1);
    expect(movie.frames[0].eventType).to.equal('click');
  });

  it('Add frame as a Frame instance', () => {
    let frame = new Frame({eventType: 'click'});
    movie.addFrame(frame);
    expect(movie.getFrames().length).to.equal(1);
    expect(movie.frames[0].eventType).to.equal('click');
  });

  it('Adding frame as an object set automatically a timestamp', () => {
    movie.addFrame({eventType: 'click'});
    expect(movie.frames[0].ts).to.not.equal(0);
  });

  it('Adding frame as a Frame instance timestamp is not changed', () => {
    let frame = new Frame({eventType: 'click'});
    movie.addFrame(frame);
    expect(movie.frames[0].ts).to.equal(0);
  });

  it('Add empty object as a frame', () => {
    movie.addFrame({});
    expect(movie.getFrames().length).to.equal(1);
    expect(movie.frames[0].eventType).to.equal('');
  });

  it('Add empty parameter as a frame', () => {
    movie.addFrame();
    expect(movie.getFrames().length).to.equal(1);
    expect(movie.frames[0].eventType).to.equal('');
  });

  it('Add null object as a frame', () => {
    movie.addFrame(null);
    expect(movie.getFrames().length).to.equal(0);
  });

  it('Add string object as a frame', () => {
    movie.addFrame('test');
    expect(movie.getFrames().length).to.equal(0);
  });

  it('The scene is correctly encoded', () => {
    movie.scene = 'PGgxPnRlc3Q8L2gxPg==';
    expect(movie.getDecodedScene()).to.equal('<h1>test</h1>');
  });

  it('The encoded scene is cached', () => {
    movie.scene = 'PGgxPnRlc3Q8L2gxPg==';
    movie.getDecodedScene();
    movie.scene = 'dGVzdA==';
    expect(movie.getDecodedScene()).to.equal('<h1>test</h1>');
  });

  describe('Initialization with options', () => {

    beforeEach(() => {
      movie = new Movie({
        top: 1,
        left: 2,
        scrollX: 3,
        scrollY: 4,
        scene: 'dGVzdA==',
        frames: [{eventType:'click'}]
      });
    });

    it('Top is correct', () => {
      expect(movie.top).to.equal(1);
    });

    it('Left is correct', () => {
      expect(movie.left).to.equal(2);
    });

    it('ScrollX is correct', () => {
      expect(movie.scrollX).to.equal(3);
    });

    it('ScrollY is correct', () => {
      expect(movie.scrollY).to.equal(4);
    });

    it('Frames are correct', () => {
      expect(movie.getFrames().length).to.equal(1);
      expect(movie.frames[0].eventType).to.equal('click');
    });

    it('ScrollY is correct', () => {
      let frame = movie.getFrames()[0];
      expect(JSON.stringify(movie)).to.equal(`{"top":${movie.top},"left":${movie.left},"scrollX":${movie.scrollX},"scrollY":${movie.scrollY},"scene":"dGVzdA==","frames":[{"eventType":"${frame.eventType}","options":{},"scrollX":${frame.scrollX},"scrollY":${frame.scrollY},"cursorX":${frame.cursorX},"cursorY":${frame.cursorY},"height":${frame.height},"width":${frame.width},"ts":${frame.ts}}]}`);
    });

  });


})