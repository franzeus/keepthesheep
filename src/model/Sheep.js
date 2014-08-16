import src.model.Entity as Entity
import ui.SpriteView as SpriteView;
import math.geom.Vec2D as Vec2D;
import math.geom.Circle as Circle;
import math.util as util;
import animate;
import src.model.states.StateIdle as StateIdle;
import src.model.states.StateMoveRandomly as StateMoveRandomly;
import src.model.states.StateDead as StateDead;

exports = Class(Entity, function(supr) {

  var spritesheet_data = {
    url: "resources/images/sheep_pixel_128.png",
    width: 128, // animation frame width
    height: 128, // animation frame height
    offsetX: 0, // horizontal space between frame images, including padding
    offsetY: 0, // vertical space between frame images, including padding
    startX: 0, // x coordinate of first frame on sheet
    startY: 0, // y coordinate of first frame on sheet
    anims: {
        idle: [ [0, 0] ],
        move: [ [0, 0] ],
        dead: [ [1, 0] ]
    },
    handleEvents: true
  };

  this.init = function (opts) {
    this.maxWorldX = Math.round(opts.maxWorldX);
    this.maxWorldY = Math.round(opts.maxWorldY);
    opts = merge(opts, {
        type: "Sheep",
        width: 128,
        height: 128,
        collides_with: ['Border', 'Sheep', 'Wolf'],
        collision_shape: Circle
    });
    supr(this, 'init', [opts]);
    this.style.anchorX = this.style.width * 0.5;
    this.style.anchorY = this.style.height * 0.5;
    this.collision_shape_radius = 64;
    this.collisionRadiusMap = {
      'Border': 1,
      'Sheep': 130,
      'Wolf': 60
    };

    this.style.scale = 1;

    this.sprite = new SpriteView({
      x: 0,
      y: 0,
      width: spritesheet_data.width,
      height: spritesheet_data.height,
      offsetX: 0,
      offsetY: 0,
      sheetData : spritesheet_data,
      frameRate: 5,
      handleEvents: true,
      centerAnchor: true
    });
    this.vec = new Vec2D({
      x: opts.x, 
      y: opts.y
    });
    this.addSubview(this.sprite);
    this.sprite.startAnimation('move', {
      loop : true
    });
    this.speed = util.random(10, 15);

    this.states = {
      idle: new StateIdle(),
      move: new StateMoveRandomly(),
      dead: new StateDead()
    };

    this.on('InputSelect', bind(this, function () {
      this.onTap.call(this);
    }));

  };

  this.moveRandomly = function() {
    this.changeState('move');
  };

  this.getCollisionShape = function(entityType) {
    var shape = null;
    var radius = this.collisionRadiusMap[entityType] || this.collision_shape_radius;
    if (this.collision_shape) {
      var x = this.style.x + this.style.anchorX;
      var y = this.style.y + this.style.anchorY;
      shape = new this.collision_shape(x, y, radius);
    }
    return shape;
  };

  this.onTap = function() {
    if (this.touchLock) return;
    var randAction = util.random(0, 100);
    this.bounceDown();
    this.queue.removeAllTasks('moveRandomly');
    // Either inverse direction of the sheep or just stop it, random decides
    if (randAction > 80) {
      this.inverseDirection().then(bind(this, function() {
        this.queue.add('moveRandomly', [2000, 5000]);
      }));
    } else {
      this.stopMoving();
      this.queue.add('moveRandomly', [2000, 8000]);
    }
  };

  this.collidesWith = function(entity) {
    if (this.isGhost) return;

    if (entity.type === 'Border' || entity.type === 'Wolf') {
      this.changeState('dead');
      return;
    }

    if (entity.type === this.type) {

      if (this.style.x > entity.style.x) {
        this.queue.removeAllTasks('moveRandomly');
        this.inverseDirection();
      } else {
        this.stopMoving();
        this.queue.add('moveRandomly', [2000, 4000]);
      }

    }
    this.lastCollidedEntity = entity;
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