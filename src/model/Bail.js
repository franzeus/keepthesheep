import src.model.Entity as Entity
import ui.SpriteView as SpriteView;
import math.geom.Vec2D as Vec2D;
import math.geom.Circle as Circle;
import math.util as util;
import animate;

exports = Class(Entity, function(supr) {

  var spritesheet_data = {
    url: "resources/images/bell.png",
    width: 64, // animation frame width
    height: 64, // animation frame height
    offsetX: 0, // horizontal space between frame images, including padding
    offsetY: 0, // vertical space between frame images, including padding
    startX: 0, // x coordinate of first frame on sheet
    startY: 0, // y coordinate of first frame on sheet
    anims: {
        idle: [ [0, 0] ]
    },
    handleEvents: true
  };

  this.init = function (opts) {
    this.maxWorldX = Math.round(opts.maxWorldX);
    this.maxWorldY = Math.round(opts.maxWorldY);
    opts = merge(opts, {
        type: "Bail",
        width: 64,
        height: 64,
        collides_with: [],
        collision_shape: Circle
    });
    supr(this, 'init', [opts]);
    this.style.anchorX = this.style.width * 0.5;
    this.style.anchorY = this.style.height * 0.5;
    this.collision_shape_radius = 30;

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

    this.on('InputSelect', bind(this, function () {
      this.onTap.call(this);
    }));

    this.styleAnimator = animate(this);
  };

  this.getCollisionShape = function() {
    var shape = null;
    if (this.collision_shape) {
      var x = this.style.x + this.style.anchorX;
      var y = this.style.y + this.style.anchorY;
      shape = new this.collision_shape(x, y, this.collision_shape_radius);
    }
    return shape;
  };

  this.setInactive = function() {
    this.touchLock = true;
    var rad = Math.PI / 4;
    var time = 200;
    var fn = animate.easeOut;
    this.styleAnimator.now({
      r: (rad * (-1))
    }, time, fn).then({
      r: rad
    }, time, fn).then({
      r: (rad * (-1))
    }, time, fn).then({
      r: rad
    }, time, fn).then({
      opacity: 0
    }, time * 2);
  };

  this.onTap = function() {
    if (this.touchLock) return;
    this.setInactive();
    this.emit('Bail:tapped');
  };

  
});