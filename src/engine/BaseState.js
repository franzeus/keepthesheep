import math.util as util;

exports = Class(function () {

  this.init = function () {
    this.name = null;
    this.is_current = false;
  };

  this.onEnter = function(object, params) {
    this.is_current = this._onEnter(object, params);
    return this.is_current;
  };

  this.execute = function(object) {
    return;
  };

  this.onExit = function(object) {
    this.is_current = false;
    return this._onExit(object);
  };

  this.setSprite = function(object, spriteName) {
    if (object.sprite && object.sprite._animations.hasOwnProperty(spriteName)) {
      object.sprite.startAnimation(spriteName, {
        loop : true
      });
    }
  };

});

