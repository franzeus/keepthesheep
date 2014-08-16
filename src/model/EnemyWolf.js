import src.model.Enemy as Enemy;
import ui.SpriteView as SpriteView;
import math.geom.Vec2D as Vec2D;
import math.geom.Circle as Circle;
import math.util as util;
import animate;

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
        collides_with: ['Sheep'],
        collision_shape: Circle,
        backgroundColor: '#00FF00'
    });
    supr(this, 'init', [opts]);
    this.style.anchorX = this.style.width * 0.5;
    this.style.anchorY = this.style.height * 0.5;
    this.collision_shape_radius = 30;
    this.speed = 150;

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
    this.sprite.startAnimation('idle', {
      loop : true
    });
    this.teaseMe();
  };

  this.attack = function(target) {
    this.isAttacking = true;
    this.speed = 100;
    this.moveTo(target.style.x, target.style.y, animate.linear);
  };

  /**
   * @param {String} position - top, left, right or bottom of the screen
   */
  this.teaseMe = function() {
    var x = this.style.x;
    var y = this.style.y;
    var centerX = this.maxWorldX / 2;
    var centerY = this.maxWorldY / 2;
    var distance = 100;
    var angle = this.getRotateToAngle(x, y, centerX, centerY);

    var pointX = x + distance * Math.cos(angle);
    var pointY = y + distance * Math.sin(angle);

    this.moveTo(pointX, pointY).wait(3000).then({
      x: x,
      y: y
    }, 3000).then(bind(this, function() {
      this.emit('Wolf:readyToAttack', this);
    }));
  };

  this.onTap = function() {
    if (this.touchLock || !this.isAttacking) return;
    this.bounceDown();
    //this.setInactive();
    //this.emit('Enemy:tapped', this.type);
  };

  this.collidesWith = function(entity) {
    if (entity.type === 'Sheep') {
      this.stopMoving();
    }
  };

});