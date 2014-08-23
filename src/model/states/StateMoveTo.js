import math.util as util;
import math.geom.Line as Line;
import src.engine.BaseState as BaseState;
import animate;

exports = Class(BaseState, function () {

  this.init = function () {
    this.name = 'StateMoveTo';
    this.animator = null;
  };

  this._onEnter = function(object, params) {
    var entered = false;

    if (!object.isInState('dead')) {
      entered = true;
      this.setSprite(object, 'move');
      this.animator = animate(object, 'moveAnimation');
    }

    return entered;
  };

  /**
   * Moves this view to a point, also rotates to its direction
   * @param {Number} targetX - Destination x
   * @param {Number} targetY - Destination y
   * @param {Number} easeFn - Optional the easing function of the animation
   * @return {animate}
   */
  this.moveTo = function(object, targetX, targetY, speed, easeFn, callback) {
    if (targetX === undefined || targetY === undefined) {
      return;
    }

    var currentX = object.style.x;
    var currentY = object.style.y;
    var angle = object.getRotateToAngle(currentX, currentY, targetX, targetY);
    var line = new Line(currentX, currentY, targetX, targetY);
    var distance = line.getLength();
    var t = Math.round((distance / speed) * 100);
    return this.animator.now({ r: angle }, 400, animate.linear)
                        .then({ x: targetX, y: targetY }, t, easeFn)
                        .then(function() {
                          if (typeof callback === 'function') {
                            callback();
                          } else {
                            object.returnToLastState();
                          }
                        });
  };

  this.execute = function(object, params, callback) {
    if (!this.is_current || !object || !params.x || !params.y) {
      console.error('No params for StateMoveTo.execute OR is not current state');
      return false;
    }
    var speed = params.speed || object.speed;
    var easeFn = params.easeFn || animate.easeIn;
    this.moveTo(object, params.x, params.y, speed, easeFn, callback);
    return true;
  };

  this._onExit = function(object) {
    this.animator.clear();
    return;
  };

});

