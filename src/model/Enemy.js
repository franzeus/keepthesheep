import src.model.Entity as Entity
import ui.SpriteView as SpriteView;
import math.geom.Vec2D as Vec2D;
import math.geom.Circle as Circle;
import math.util as util;
import animate;

exports = Class(Entity, function(supr) {

  this.init = function (opts) {
    this.maxWorldX = Math.round(opts.maxWorldX);
    this.maxWorldY = Math.round(opts.maxWorldY);
    opts = merge(opts, {
        type: "Enemy",
        width: 64,
        height: 64,
        collides_with: [],
        collision_shape: Circle
    });
    supr(this, 'init', [opts]);
    this.collision_shapes = [
      ['sight', Circle, 200],
      ['body', Circle, 64]
    ];
    this.maxAttackAttemps = 2;
    this.style.anchorX = this.style.width * 0.5;
    this.style.anchorY = this.style.height * 0.5;
    this.collision_shape_radius = 30;
    this.styleAnimator = animate(this);
    this.attackTarget = null;
    this.isAttacking = false;

    this.on('InputSelect', bind(this, function () {
      this.onTap.call(this);
    }));
  };

  this.attack = function(target) {
    this.isAttacking = true;
    this.moveTo(target.style.x, target.style.y, animate.easeIn);
  };

  this.setInactive = function() {
    this.touchLock = true;
    this.stopMoving();
  };

  this.onTap = function() {
    if (this.touchLock) return;
    this.setInactive();
    this.emit('Enemy:tapped', this.type);
  };


});
