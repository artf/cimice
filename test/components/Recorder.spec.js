import {expect} from 'chai';
import sinon from 'sinon';
import Movie from '../../src/components/Movie.js';
import Recorder from '../../src/components/Recorder.js';
import DocumentLoader from './DocumentLoader';

describe('Recorder', () => {
  DocumentLoader.load();
  let recorder;
  let onEventSpy;
  let eventObject;

  describe('Initialization with options', () => {

    beforeEach(() => {
      onEventSpy = sinon.spy();
      eventObject = document.createEvent("HTMLEvents");
      eventObject.initEvent("click", true, true);
      recorder = new Recorder({
        target: document.getElementById('target'),
        events: ['click', 'mousemove'],
        onEvents: { click: onEventSpy },
        listeners: { 'scroll': window },
      });
    });

    it('Assigned events to listen', () => {
      expect(recorder.getEvents()).to.have.members(['mousemove', 'click']);
    });

    it('Target assigned correctly', () => {
      expect(recorder.getTarget()).to.be.instanceOf(window.HTMLElement);
    });

    it('Triggers custom callback', () => {
      recorder.startRecording();
      recorder.getTarget().dispatchEvent(eventObject);
      expect(onEventSpy.callCount).to.equal(1);
    });

  });

  beforeEach(() => {
    recorder = new Recorder();
  });

  it('Target undefined', () => {
    expect(recorder.target).to.equal(undefined);
  });

  it('Default events to listen', () => {
    expect(recorder.getEvents()).to.have.members(['scroll', 'mousemove', 'click', 'resize']);
  });

  it('Default listeners', () => {
    expect(recorder.getListeners()).to.be.empty;
  });

  it('Returns target in case no event found', () => {
    let target = document.getElementById('target');
    recorder.setTarget(target);
    expect(recorder.getListener('test')).to.equal(target);
  });

  it('Empty event handlers', () => {
    expect(recorder.eventHandlers).to.be.empty;
  });

  it('Recording flag is false', () => {
    expect(recorder.isRecording).to.equal(false);
  });

  it('No movie inside', () => {
    expect(recorder.movie).to.equal(undefined);
  });

  it('Clean events', () => {
    recorder.setEvents();
    expect(recorder.getEvents()).to.be.empty;
  });

  it('Set event as a string', () => {
    recorder.setEvents('test');
    expect(recorder.getEvents()).to.have.members(['test']);
  });

  it('Set events as an array', () => {
    recorder.setEvents(['test1','test2']);
    expect(recorder.getEvents()).to.have.members(['test2', 'test1']);
  });

  it('Init movie without target throws an error', () => {
    expect(() => recorder.initMovie()).to.throw();
  });

  it('Init new movie', () => {
    let target = document.getElementById('target');
    recorder.setTarget(target);
    let movie = recorder.initMovie();
    expect(recorder.getMovie()).to.be.instanceOf(Movie);
  });

  it('The movie scene is correctly encoded', () => {
    let target = document.getElementById('target');
    target.innerHTML = '<h1>test</h1>';
    recorder.setTarget(target);
    let movie = recorder.initMovie();
    expect(movie.scene).to.equal('PGgxPnRlc3Q8L2gxPg==');
  });

  it('Get top and left position of the target', () => {
    recorder.setTarget(document.getElementById('target'));
    expect(recorder.getPosTarget()).to.deep.equal({left:0, top: 0});
  });

  it('Abstract event callback adds correctly a frame', () => {
    let fakeEvent = {
      type: 'test',
      pageX: 0,
      pageY: 0,
      target:{
        scrollTop: 0,
        scrollLeft: 0,
      }
    };
    recorder.setTarget(document.getElementById('target'));
    recorder.startRecording();
    let movie = recorder.getMovie();
    recorder.abstractEventCallback(recorder, movie, fakeEvent);
    expect(movie.getFrames().length).to.equal(1);
    expect(movie.getFrames()[0].eventType).to.equal('test');
  });


  describe('On start recording', () => {

    beforeEach(() => {
      recorder.setTarget(document.getElementById('target'));
    });

    it('Emits startRecording event', () => {
      let spy = sinon.spy();
      recorder.on("startRecording", spy);
      recorder.startRecording();
      expect(spy.called).to.equal(true);
    });

    it('Correctly binds events', () => {
      recorder.setEvents(['test1', 'test2', 'test3']);
      recorder.startRecording();
      expect(recorder.eventHandlers.length).to.equal(3);
    });

    it('Event triggers correctly', () => {
      let spy = sinon.spy();
      let event = document.createEvent("HTMLEvents");
      event.initEvent("test", true, true);
      recorder.target.addEventListener('test', spy);
      recorder.startRecording();
      recorder.target.dispatchEvent(event);
      expect(spy.called).to.equal(true);
    });

    it('Triggers correctly abstractEventCallback on attached event', () => {
      let event = document.createEvent("HTMLEvents");
      event.initEvent("test", true, true);
      sinon.stub(recorder, 'abstractEventCallback');
      recorder.setEvents(['test']);
      recorder.startRecording();
      recorder.getTarget().dispatchEvent(event);
      expect(recorder.abstractEventCallback.callCount).to.equal(1);
    });

  });

  describe('On start recording', () => {

    beforeEach(() => {
      recorder.setTarget(document.getElementById('target'));
      recorder.startRecording();
      eventObject = document.createEvent("HTMLEvents");
      eventObject.initEvent("click", true, true);
    });

    it('Triggers correctly recording event', () => {
      let spy = sinon.spy();
      recorder.on("recording", spy);
      recorder.getTarget().dispatchEvent(eventObject);
      expect(spy.called).to.equal(true);
    });

    it('Triggers correctly same events', () => {
      let spy = sinon.spy();
      recorder.on("click", spy);
      recorder.getTarget().dispatchEvent(eventObject);
      expect(spy.called).to.equal(true);
    });

  });

  describe('On stop recording', () => {

    beforeEach(() => {
      recorder.setTarget(document.getElementById('target'));
    });

    it('Emits stopRecording event', () => {
      let spy = sinon.spy();
      recorder.on("stopRecording", spy);
      recorder.startRecording();
      recorder.stopRecording();
      expect(spy.called).to.equal(true);
    });

    it('Returns Movie', () => {
      recorder.startRecording();
      expect(recorder.stopRecording()).to.be.instanceOf(Movie);
    });

    it('Correctly unbinds events', () => {
      sinon.stub(recorder.target, 'removeEventListener');
      recorder.setEvents(['test1', 'test2']);
      recorder.startRecording();
      recorder.stopRecording();
      expect(recorder.target.removeEventListener.callCount).to.equal(2);
    });

    it('No Movie if Recorder never started', () => {
      expect(recorder.stopRecording()).to.be.empty;
    });

  });

})