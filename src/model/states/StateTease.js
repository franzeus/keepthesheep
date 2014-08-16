import math.util as util;
import src.engine.BaseState as BaseState;
import animate;

exports = Class(BaseState, function () {

  this.init = function () {
    this.name = 'StateTease';
    this.is_current = false;
  };

  this._onEnter = function(object, params) {
    var entered = false;

    if (!object.isInState('dead')) {
      entered = true;
      object.touchLock = true;
    }

    return entered;
  };

  this.execute = function(object, params, callback) {

    var x = GLOBAL.WORLD_WIDTH - 100;
    var y = GLOBAL.WORLD_HEIGHT;
    object.style.x = x;
    object.style.y = y;
    var pointY = y - object.style.height;

    object.moveTo(x, pointY).wait(3000).then({
      x: x,
      y: y
    }, 1000).then(bind(this, function() {
      if (typeof callback === 'function') {
        callback();
      }
    }));
    return true;
  };

  this._onExit = function(object) {
    object.touchLock = false;
    return;
  };

});

