import src.model.Enemy as Enemy;
import ui.SpriteView as SpriteView;
import math.geom.Vec2D as Vec2D;
import math.geom.Circle as Circle;
import math.util as util;
import animate;
import src.model.states.StateIdle as StateIdle;
import src.model.states.StateAttack as StateAttack;
import src.model.states.StateTease as StateTease;
import src.model.states.StateDead as StateDead;
import src.model.states.StateMoveTo as StateMoveTo;

exports = Class(Enemy, function(supr) {

  var spritesheet_data = {
    url: "resources/images/wolf.png",
    width: 48, // animation frame width
    height: 48, // animation frame height
    offsetX: 0, // horizontal space between frame images, including padding
    offsetY: 0, // vertical space between frame images, including padding
    startX: 0, // x coordinate of first frame on sheet
    startY: 0, // y coordinate of first frame on sheet
    anims: {
        idle: [ [0, 2] ]
    },
    handleEvents: true
  };

  this.init = function (opts) {
    opts = merge(opts, {
        type: "Wolf",
        width: 128,
        height: 128,
        backgroundColor: '#543716'
    });
    supr(this, 'init', [opts]);
    this.maxWorldX = opts.maxWorldX || 0;
    this.maxWorldY = opts.maxWorldY || 0;
    this.collides_with = ['Sheep'];
    this.collision_shapes = [
      ['body', Circle, 64]
    ];
    this.collisionRadiusMap = {
      'Sheep': 60
    };
    this.style.anchorX = this.style.width * 0.5;
    this.style.anchorY = this.style.height * 0.5;
    this.collision_shape_radius = 30;
    this.speed = 40;
    this.states = {
      dead: new StateDead(),
      moveTo: new StateMoveTo(),
      attack: new StateAttack(),
      tease: new StateTease(),
      idle: new StateIdle()
    };
    this.default_state = {
      name: 'attack',
      params: {}
    };

    this.sprite = new SpriteView({
      x: 0,
      y: 0,
      width: spritesheet_data.width,
      height: spritesheet_data.height,
      offsetX: 0,
      offsetY: 0,
      sheetData : spritesheet_data,
      frameRate: 1,
      handleEvents: true,
      centerAnchor: true
    });
    this.addSubview(this.sprite);
    this.changeState('idle');
  };

  this.attack = function(target) {
    var params = {
      target: target
    };

    this.changeState('tease', {}, bind(this, function() {
      this.changeState('attack', params);
    }));
  };

  this.onTap = function() {
    if (this.touchLock) return;
    this.bounceDown();
    this.changeState('dead');
    this.animator.now({
      opacity: 0
    }, 800).then(bind(this, function() {
      this.emit('Enemy:tapped', this.type);
    }));
  };

  this.collidesWith = function(entity) {
    if (entity.type === 'Sheep') {
      var radian = this.getRotateToAngle(this.style.x, this.style.y, entity.x + entity.style.width / 2, entity.y + entity.style.height / 2);
      this.rotateTo(radian);
      this.clearStates();
      this.changeState('idle');
    }
  };

});
