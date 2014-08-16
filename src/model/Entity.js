import ui.View;
import animate;
import math.geom.Vec2D as Vec2D;
import math.geom.Line as Line;
import src.engine.Queue as Queue;
import src.model.states.StateIdle as StateIdle;

exports = Class(ui.View, function (supr) {

    this.init = function (opts) {
      this.type = opts["type"] || "Entity";
      this.epoch_origin = opts["epoch_origin"] || 0;
      this.collision_shape = opts["collision_shape"] || null;
      var view_opts = {
          x: opts.x,
          y: opts.y,
          scale: opts.scale || 1,
          width: opts.width || 0,
          height: opts.height || 0,
          offsetX: opts.offsetX || 0,
          offsetY: opts.offsetY || 0,
          r: opts.r || 0,
          clip: false
      };
      merge(view_opts, opts);
      this.isDead = false;
      this.speed = 100;
      this.isMoving = false;
      this.doUpdate = true;
      this.updateFn = null;
      this.state_manager = null;
      this.directionVec = new Vec2D({ x: 0, y: 0 });
      this.states = {
        idle: new StateIdle()
      };
      this.current_state = null;
      this.prev_states = [];
      this.current_state_name = null;
      this.collisionRadiusMap = {};
      this.lastCollidedEntity = null;
      this.id = this.getId();
      supr(this, 'init', [view_opts]);
      this.queue = new Queue(this);
      this.collides_with = opts["collides_with"] || [];
      this.isInCollision = false;
      this.touchLock = false;
      this.isGhost = false;
      this.animator = animate(this, 'moveAnimation');
      this.scaleAnimator = animate(this, 'scaleAnimation');
      this.lockScale = false;
    };

    /**
     * Returns random string. Useful for IDs
     * @param {Number} chars - The string length
     * @return {String}
     */
    this.getId = function(chars) {
      chars = chars || 15;
      return (Math.random() + 1).toString(36).substring(2, chars);
    };

    this.tick = function() {
      this.queue.workQueue();
    };

    this.stopMoving = function() {
      this.changeState('idle');
    };

    this.getCollisionShape = function(entityType) {
      return null;
    };

    this.changeState = function(stateName, params) {
      if (this.current_state) {
        this.current_state.onExit(this);
        this.prev_states.push(this.current_state.name);
      }
      var onEnter = false;
      var state = this.states[stateName];
      if (state) {
        onEnter = state.onEnter(this, params);
        // Check if state could be changed
        if (onEnter) {
          this.current_state_name = stateName;
          this.current_state = state;
          this.current_state.execute(this);
        }
      }
      return onEnter;
    };

    this.hasHigherPrioThanCurrentState = function(stateName) {
      var currentState = this.current_state_name;
      if (stateName === currentState) return true;
      for (var state in this.states) {
        if (stateName === state) {
          return true;
        } else if (currentState === state) {
          return false;
        }
      }
    };

    this.isInState = function(stateName) {
      return this.current_state_name === stateName;
    };

    this.collidesWith = function(entity) {
      console.log(this.type + " collides with " + entity.type);
    };

    this.setIsInCollision = function(state) {
      this.isInCollision = state;
      if (!state) {
        this.lastCollidedEntity = null;
      }
    };

    this.canCollideWith = function(entity) {
      var isSameType = this.type === entity.type;
      var isInCollideList = this.collides_with.indexOf(entity.type) > -1;
      var isLastEntity = this.lastCollidedEntity && this.lastCollidedEntity.id === entity.id
      return this.doUpdate && (!this.isGhost || !entity.isGhost) && (isInCollideList) && !isLastEntity;
    };

    this.rotateTo = function(angle) {
      this.style.r = angle;
    };

    this.inverseDirection = function() {
      var inv = this.directionVec.negate();
      return this.moveTo(inv.x, inv.y, animate.easeOut);
    };

    this.moveTo = function(targetX, targetY, easeFn) {
      if (targetX === undefined || targetY === undefined) {
        return;
      }
      easeFn = easeFn || animate.linear;
      this.stopMoving();

      var currentX = this.style.x;
      var currentY = this.style.y;
      var angle = this.getRotateToAngle(currentX, currentY, targetX, targetY);
      var line = new Line(currentX, currentY, targetX, targetY);
      var distance = line.getLength();
      var t = Math.round((distance / this.speed) * 100);
      return this.animator.now({ r: angle }, 400, animate.linear)
                          .then({ x: targetX, y: targetY }, t, easeFn);
    };

    this.getRotateToAngle = function(currentX, currentY, targetX, targetY) {
      var v = new Vec2D({ x: currentX, y: currentY });
      var b = new Vec2D({ x: targetX, y: targetY });
      this.directionVec = b.minus(v);
      return this.directionVec.getAngle();
    };

    this.bounceDown = function() {
      if (this.style.scale < 1) {
        return;
      }
      this.scaleAnimator.clear();
      this.scaleAnimator.now({
        scale: 0.7
      }, 50).then({
        scale: 1
      }, 300);
    };
});