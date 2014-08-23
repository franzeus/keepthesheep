import math.util as util;
import math.geom.Rect as Rect;
import src.engine.BaseState as BaseState;
import animate;

exports = Class(BaseState, function () {

  this.init = function () {
    this.name = 'StateAttack';
    this.is_current = false;
    this.attackAttemps = 0;
  };

  this._onEnter = function(object, params) {
    var entered = false;
    var isDead = object.isInState('dead');
    var isIdling = object.isInState('idle');

    // Set start position for attacker
    if (this.attackAttemps === 0) {
      var worldRect = new Rect(0, 0, GLOBAL.WORLD_WIDTH, GLOBAL.WORLD_HEIGHT);
      // Recommended Rect.SIDES does not work, but they represent numbers for each side (top, left ...)
      var side = util.random(1, 4);
      var edge = worldRect.getSide(side);
      var pos = edge.start;
      object.style.x = pos.x;
      object.style.y = pos.y;
    }

    // When attacker did not get the target in maxAttackAttemps,
    // then he flees
    if (this.attackAttemps >= object.maxAttackAttemps) {
      object.changeState('moveTo', {x: 0, y: 0 }, function() {
        // Force stoping
      });
      return false;
    }

    // State idle means the attacker got the target
    if (!isIdling && !isDead) {
      entered = true;
    }
    return entered;
  };

  this.execute = function(object, params) {
    var target = params.target;
    this.attackAttemps++;

    object.changeState('moveTo', {
      x: target.style.x,
      y: target.style.y
    });

    return true;
  };

  this._onExit = function(object) {
    return;
  };

});
