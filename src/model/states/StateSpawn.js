import math.util as util;
import src.engine.BaseState as BaseState;

exports = Class(BaseState, function () {

  this.init = function () {
    this.name = 'StateSpawn';
    this.is_current = false;
    this.isExecuting = false;
  };

  this._onEnter = function(object, params) {
    var entered = false;

    if (!object.isInState('dead')) {
      entered = true;
      object.isGhost = true;
      object.touchLock = true;
    }

    return entered;
  };

  this.execute = function(object, params) {
    object.blink(0, 18);
    object.changeState.call(object, 'moveTo', params, function() {
      object.isGhost = false;
      object.touchLock = false;
      object.returnToDefaultState.call(object);
    });
    return true;
  };

  this._onExit = function(object) {
    return true;
  };

});
