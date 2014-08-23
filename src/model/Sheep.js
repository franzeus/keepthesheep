import src.model.Entity as Entity
import ui.SpriteView as SpriteView;
import math.geom.Vec2D as Vec2D;
import math.geom.Circle as Circle;
import math.util as util;
import src.model.states.StateIdle as StateIdle;
import src.model.states.StateMoveRandomly as StateMoveRandomly;
import src.model.states.StateDead as StateDead;
import src.model.states.StateFlee as StateFlee;
import src.model.states.StateMoveTo as StateMoveTo;
import src.model.states.StateSpawn as StateSpawn;

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
    merge(opts, {
        type: "Sheep",
        width: 128,
        height: 128
    });
    this.maxWorldX = Math.round(opts.maxWorldX);
    this.maxWorldY = Math.round(opts.maxWorldY);
    supr(this, 'init', [opts]);
    this.speed = util.random(10, 15);
    this.initSpeed = this.speed;
    this.style.anchorX = this.style.width * 0.5;
    this.style.anchorY = this.style.height * 0.5;
    // Collision
    this.collides_with = ['Border', 'Sheep', 'Wolf', 'Shepard'];
    this.collision_shapes = [
      ['sight', Circle, 300],
      ['body', Circle, 64]
    ];
    this.collision_shape = Circle;
    this.collision_shape_radius = 64;
    this.collisionRadiusMap = {
      'Border': 1,
      'Sheep': 60,
      'Wolf': 60,
      'Shepard': 80
    };

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

    // States
    this.states = {
      dead: new StateDead(),
      flee: new StateFlee(),
      spawn: new StateSpawn(),
      moveTo: new StateMoveTo(),
      moveRand: new StateMoveRandomly(),
      idle: new StateIdle()
    };

    this.default_state = {
      name: 'moveRand',
      params: {}
    };

    this.addSubview(this.sprite);
    this.on('InputSelect', bind(this, function () {
      this.onTap.call(this);
    }));

    this.changeState(this.default_state.name);
  };

  this.moveRandomly = function() {
    this.changeState('moveRand');
  };

  this.onTap = function() {
    if (this.touchLock) return;
    var randAction = util.random(0, 100);
    this.bounceDown();
    if (this.changeState('idle')) {
      this.clearStates();

      // Either inverse direction of the sheep or just stop it, random decides
      if (randAction > 80) {
        var inverseDirection = this.getInverseDirection();
        this.changeState('moveTo', inverseDirection);
      } else {
        this.queue.removeAllTasks('returnToDefaultState');
        this.queue.add('returnToDefaultState', [2000, 8000]);
      }

    }
  };

  this.setIsInCollision = function(state) {
    this.isInCollision = state;
    if (!state) {
      this.lastCollidedEntity = null;
    }
  };

  this.collidesWith = function(entity, collisionShape) {
    if (this.isGhost) return;
    var collisionName = collisionShape[0];

    if (collisionName === 'body' && (entity.type === 'Border' || entity.type === 'Wolf')) {
      this.changeState('dead');
      return;
    }

    // Sheep flees if it sees wolf
    if (collisionName === 'sight' &&
        entity.type === 'Wolf' &&
        this.current_state &&
        !this.current_state.executed &&
        entity.current_state_name !== 'tease') {
      this.changeState('flee', { attacker: entity });
      return;
    }

    // Sheep flees if it sees shepard
    if (collisionName === 'sight' && entity.type === 'Shepard' && !this.isInState('flee')) {
      this.changeState('flee', { x: this.maxWorldX / 2, y: this.maxWorldY / 2 });
      return;
    }

    if (entity.type === this.type) {
      return;
    }
  };

});
