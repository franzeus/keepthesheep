import math.util as util;
import src.engine.BaseState as BaseState;

exports = Class(BaseState, function () {

  this.init = function () {
    this.name = 'StateIdle';
    this.is_current = false;
  };

  this._onEnter = function(object) {
    var entered = false;

    if (!object.isInState('dead')) {
      entered = true;
      this.setSprite(object, 'idle');
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
