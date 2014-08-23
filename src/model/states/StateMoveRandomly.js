import math.util as util;
import src.engine.BaseState as BaseState;
import animate;

exports = Class(BaseState, function () {

  this.init = function () {
    this.name = 'StateMoveRandomly';
    this.is_current = false;
  };

  this._onEnter = function(object) {
    var entered = false;

    if (!object.isInState('dead')) {
      entered = true;
    }

    return entered;
  };

  this.execute = function(object) {
    if (!this.is_current) { return false; }
    var x = util.random(0, object.maxWorldX);
    var y = util.random(0, object.maxWorldY);

    object.changeState('moveTo', {
      x: x,
      y: y
    });

    return true;
  };

  this._onExit = function(object) {
    return;
  };

});

