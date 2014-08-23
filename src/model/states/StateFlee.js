import math.util as util;
import src.engine.BaseState as BaseState;
import animate;
import math.geom.Vec2D as Vec2D;
import math.geom.Line as Line;

exports = Class(BaseState, function () {

  this.init = function () {
    this.name = 'StateFlee';
    this.is_current = false;
    this.executed = false;
  };

  this._onEnter = function(object, params) {
    var entered = false;
    if (!this.executed && !object.isInState('dead')) {
      this.executed = true;
      entered = true;
      //if (object.animator) {
      //  object.animator.clear();
      //}
      object.speed *= 1.5;
    }

    return entered;
  };

  this.execute = function(object, params) {
    if (!this.is_current) { return false; }
    var x = 0;
    var y = 0;

    if (params.x && params.y) {
      x = params.x;
      y = params.y;
    } else if (params.attacker) {
      var attacker = params.attacker;
      var v = new Vec2D({ x: object.style.x, y: object.style.y });
      var b = new Vec2D({ x: attacker.style.y, y: attacker.style.x });
      var directionVec = b.minus(v).negate();
      var angle = directionVec.getAngle();
      var maxAngle = Math.PI / 4;
      var randAngle = util.random(angle - maxAngle, angle + maxAngle);
      var len = 150;
      var x = object.style.x + Math.cos(randAngle) * len;
      var y = object.style.y + Math.sin(randAngle) * len;
    }

    object.moveTo(x, y, animate.linear).then(bind(this, function() {
      this.executed = false;
      object.lastCollidedEntity = null;
      object.returnToDefaultState();
    }));
    return true;
  };

  this._onExit = function(object) {
    this.executed = false;
    object.speed = object.initSpeed;
    return true;
  };

});
