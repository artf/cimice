import {expect} from 'chai';
import sinon from 'sinon';
import Movie from '../../src/components/Movie.js';
import Player from '../../src/components/Player.js';
import DocumentLoader from './DocumentLoader';

describe('Player', () => {
  DocumentLoader.load();
  let player;
  let movie;
  let target;
  let onEventSpy;
  let eventObject;

  beforeEach(() => {
    target = document.getElementById('target');
    movie = new Movie();
    player = new Player();
  });

  it('Target undefined', () => {
    expect(player.target).to.equal(undefined);
  });

  it('Movie undefined', () => {
    expect(player.movie).to.equal(undefined);
  });

  it('Cursor not undefined', () => {
    expect(player.getCursor()).to.be.instanceOf(window.HTMLElement);
  });

  it('Return correctly cursor horizontal position', () => {
    let frame = movie.addFrame({cursorX: 5});
    player.setMovie(movie);
    player.setTarget(target);
    expect(player.getCursorX(frame)).to.equal(5);
  });

  it('Return correctly cursor vertical position', () => {
    let frame = movie.addFrame({cursorY: 5});
    player.setMovie(movie);
    player.setTarget(target);
    expect(player.getCursorY(frame)).to.equal(5);
  });

  it('Playing flag is false', () => {
    expect(player.isPlaying).to.equal(false);
  });

  it('Set not valid data to movie', () => {
    expect(() => player.setMovie()).to.throw();
    expect(() => player.setMovie(null)).to.throw();
    expect(() => player.setMovie(5)).to.throw();
    expect(() => player.setMovie('test')).to.throw();
  });

  it('Set movie correctly', () => {
    let movie = new Movie();
    expect(() => player.setMovie(movie)).to.not.throw();
  });

  it('Emits stop event', () => {
    let spy = sinon.spy();
    player.on("stop", spy);
    player.stop();
    expect(spy.called).to.equal(true);
  });

  it('Init target correctly', () => {
    player.setTarget(target);
    player.initTarget();
    expect(target).to.not.be.empty;
  });

  it('Play throws error without target', () => {
    expect(() => player.play()).to.throw();
  });

  it('Play throws error without movie', () => {
    player.setTarget(target);
    expect(() => player.play()).to.throw();
  });

  it('Play frame without movie throws error', () => {
    expect(() => player.playFrom()).to.throw();
  });

  it('Play frame correctly', () => {
    player.setMovie(movie);
    player.setTarget(target);
    let frame = movie.addFrame({eventType:'click'});
    expect(() => player.playFrom(frame)).to.not.throw();
  });

  it('Returns displayer', () => {
    player.setMovie(movie);
    player.setTarget(target);
    let displayer = player.getDisplayer();
    expect(displayer).to.be.instanceOf(window.HTMLElement);
  });

  it('Returns displayer with the correct content', () => {
    movie = new Movie({ scene: 'PGgxPnRlc3Q8L2gxPg=='});
    player.setMovie(movie);
    player.setTarget(target);
    let displayer = player.getDisplayer();
    expect(displayer.contentWindow.document.body.innerHTML).to.equal('<h1>test</h1>');
  });



  describe('On start playing', () => {

    beforeEach(() => {
      onEventSpy = sinon.spy();
      movie.scene = document.getElementById('scene');
      player.setTarget(target);
      player.setMovie(movie);
    });

    it('Play correctly', () => {
      movie.scene = document.getElementById('scene');
      player.setTarget(target);
      player.setMovie(movie);
      expect(() => player.play()).not.to.throw();
    });

    it('Play emits play event', () => {
      player.on("play", onEventSpy);
      player.play();
      expect(onEventSpy.called).to.equal(true);
    });

    it('Doesn\'t play if alredy in playing', () => {
      player.on("play", onEventSpy);
      player.isPlaying = true;
      player.play();
      expect(onEventSpy.called).to.equal(false);
    });

    it('Play with frames', () => {
      sinon.stub(player, 'playFrom');
      let frame = movie.addFrame({eventType:'click'});
      player.play();
      expect(player.playFrom.callCount).to.equal(1);
    });

    it('Play correctly multiple frames', () => {
      player.on("playing", onEventSpy);
      let frame1 = movie.addFrame({eventType:'click'});
      let frame2 = movie.addFrame({eventType:'mousemove'});
      player.play();
      expect(onEventSpy.called).to.equal(true);
    });

    it('Play correctly with scroll frame', () => {
      player.on("playing", onEventSpy);
      let frame1 = movie.addFrame({eventType:'scroll'});
      frame1.width = 1;
      frame1.height = 1;
      player.play();
      expect(onEventSpy.called).to.equal(true);
    });

  });

  describe('Initialization with options', () => {

    beforeEach(() => {
      onEventSpy = sinon.spy();
      player = new Player({
        target: target
      });
    });

    it('Target correctly assigned', () => {
      expect(player.getTarget()).to.be.instanceOf(window.HTMLElement);
    });

  })

})