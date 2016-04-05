import {expect} from 'chai';
import Camera from '../../src/components/Camera.js';
import DocumentLoader from './DocumentLoader';

describe('Camera', () => {
  let camera;
  DocumentLoader.load();

  beforeEach(() => {
    camera = new Camera();
  });

  it('No target inside', () => {
    expect(camera.getTarget()).to.equal(undefined);
  });

  it('Throws error in case of empty target', () => {
    expect(() => camera.tryGetTarget()).to.throw();
  });

  it("Doesn't throw error in case of not empty target", () => {
    let target = document.getElementById('target');
    camera.setTarget(target);
    expect(() => camera.tryGetTarget()).to.not.throw();
  });

  it('No event callbacks inside', () => {
    expect(camera.onEvents).to.be.empty;
  });

  describe('Initialization with options', () => {

    beforeEach(() => {
      camera = new Camera({
        onEvents: {'test': 'test'}
      });
    });

    it('Event callbacks assigned correctly', () => {
      expect(camera.onEvents).to.deep.equal({'test': 'test'});
    });

    it('No target inside', () => {
      expect(camera.target).to.equal(undefined);
    });
  });

  it('Target should be an instance of HTMLElement', () => {
    expect(() => camera.setTarget('target')).to.throw();
  });

  it('Assign correctly a target', () => {
    let target = document.getElementById('target');
    expect(() => camera.setTarget(target)).to.not.throw();
  });

})