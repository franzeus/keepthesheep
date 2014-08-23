import math.util as util;
import src.engine.BaseState as BaseState;
import animate;

exports = Class(BaseState, function () {

  this.init = function () {
    this.name = 'StateDead';
    this.is_current = false;
  };

  this._onEnter = function(object) {
    var entered = false;

    if (!object.isInState('dead')) {
      entered = true;
      this.setSprite(object, 'dead');
      if (object.animator) {
        object.animator.clear();
      }
      object.isDead = true;
      object.doUpdate = false;
      object.touchLock = true;
      object.queue.cleanUp();
      object.clearStates();
    }

    return entered;
  };

  this.execute = function(object) {
    return;
  };

  this._onExit = function(object) {
    return;
  };

});

