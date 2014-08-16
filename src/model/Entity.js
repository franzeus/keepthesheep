import ui.View;
import animate;
import math.geom.Vec2D as Vec2D;
import math.geom.Line as Line;
import src.engine.Queue as Queue;
import src.model.states.StateIdle as StateIdle;

exports = Class(ui.View, function (supr) {

    this.init = function (opts) {
      var view_opts = {
          x: opts.x,
          y: opts.y,
          scale: opts.scale || 1,
          width: opts.width || 0,
          height: opts.height || 0,
          offsetX: 0,
          offsetY: 0,
          r: opts.r || 0,
          clip: false
      };
      this.id = this.getId();
      this.speed = 10;
      this.isDead = false;
      this.isGhost = false;
      this.isMoving = false;
      this.directionVec = new Vec2D({ x: 0, y: 0 });
      this.touchLock = false;
      this.doUpdate = true;
      this.type = opts.type || 'Entity';

      // States
      this.state_manager = null;
      this.states = {
        idle: new StateIdle()
      };
      this.current_state = null;
      this.prev_states = [];
      this.current_state_name = null;

      // Collision
      this.collision_shape = null,
      this.collides_with = []
      this.isInCollision = false;
      this.collisionRadiusMap = {};
      this.lastCollidedEntity = null;

      merge(view_opts, opts);
      supr(this, 'init', [view_opts]);
      this.queue = new Queue(this);
      this.animator = animate(this, 'moveAnimation');
      this.scaleAnimator = animate(this, 'scaleAnimation');
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
      this.animator.clear();
    };

    this.getCollisionShape = function(entityType) {
      return null;
    };

    this.changeState = function(stateName, params, callback) {
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
          this.current_state.execute(this, params, callback);
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

    /**
     * Returns true if entity can collide with other entity
     * @param {Object} entity - The other entity to check collision for
     * @return {Boolean}
     */
    this.canCollideWith = function(entity) {
      var isInCollideList = this.collides_with.indexOf(entity.type) > -1;
      var isLastEntity = this.lastCollidedEntity && this.lastCollidedEntity.id === entity.id;
      var isNotGhost = !(this.isGhost);
      var isNotDead = !(this.isDead);
      return this.doUpdate && isNotGhost && isNotDead && isInCollideList && !isLastEntity;
    };

    /**
     * Aligns this view towards an angle
     * @param {Number} angle - The angle in radian
     */
    this.rotateTo = function(angle) {
      this.style.r = angle;
    };

    this.inverseDirection = function() {
      var inv = this.directionVec.negate();
      return this.moveTo(inv.x, inv.y, animate.easeOut);
    };

    /**
     * Moves this view to a point, also rotates to its direction
     * @param {Number} targetX - Destination x
     * @param {Number} targetY - Destination y
     * @param {Number} easeFn - Optional the easing function of the animation
     * @return {animate}
     */
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

    this.blink = function(count) {
      this.touchLock = true;
      count = count || 0;
      var opacity = count % 2 === 0 ? 1 : 0.5;
      this.sprite.style.opacity = opacity;
      if (count >= 12) {
        this.touchLock = false;
        this.sprite.style.opacity = 1;
        return;
      }

      setTimeout(bind(this, function() {
        count++;
        this.blink.call(this, count);
      }), 400);
    };
});