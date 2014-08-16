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
    var x = util.random(0, object.maxWorldX);
    var y = util.random(0, object.maxWorldY);
    var nextExe = util.random(2000, 5000);
    object.moveTo.call(object, x, y, animate.easeIn).wait(nextExe).then(bind(this, function() {
      this.execute.call(this, object);
    }));
  };

  this._onExit = function(object) {
    return;
  };

});

