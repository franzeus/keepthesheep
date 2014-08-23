import src.model.Entity as Entity;
import ui.SpriteView as SpriteView;
import math.geom.Vec2D as Vec2D;
import math.geom.Circle as Circle;
import math.util as util;
import animate;
import src.model.states.StateIdle as StateIdle;
import src.model.states.StateTease as StateTease;
import src.model.states.StateDead as StateDead;
import src.model.states.StateMoveTo as StateMoveTo;

exports = Class(Entity, function(supr) {

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
        type: "Shepard",
        width: 128,
        height: 128,
        backgroundColor: '#FF844E'
    });
    supr(this, 'init', [opts]);
    this.maxWorldX = opts.maxWorldX || 0;
    this.maxWorldY = opts.maxWorldY || 0;
    this.collides_with = ['Sheep'];
    this.collision_shape = Circle;
    this.collision_shapes = [
      ['sight', Circle, 300],
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
      tease: new StateTease(),
      idle: new StateIdle()
    };
    this.default_state = {
      name: 'idle',
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

  this.getCollisionShape = function(collisionShape) {
    var name = collisionShape[0];
    var shape = collisionShape[1];
    var radius = collisionShape[2];
    var x = this.style.x + this.style.anchorX;
    var y = this.style.y + this.style.anchorY;
    return new shape(x, y, radius);
  };

  this.startAction = function() {
    this.changeState('tease', {}, bind(this, function() {
      this.keepAction();
    }));
  };

  this.keepAction = function() {
    var offset = 50;
    var pos = this.helper.getRandomRectEdgePoints(offset, offset, this.maxWorldX - offset, this.maxWorldY - offset);
    var first = util.random(0, 1);
    var second = first === 0 ? 1 : 0;
    var start = pos[first];
    var end = pos[second];
    var x = start.x;
    var y = start.y;
    this.style.x = x;
    this.style.y = y;
    console.log(x, y, end.x, end.y);
    this.moveTo(end.x, end.y).then(bind(this, function() {
      this.moveTo(start.x, start.y).then(bind(this, function() {
        this.moveTo(end.x, end.y);
      }));
    }));
  };

  this.collidesWith = function(entity) {
    return;
  };

});
