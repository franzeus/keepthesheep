import src.model.Entity as Entity;
import math.geom.Rect as Rect;

exports = Class(Entity, function (supr) {

    this.init = function (opts) {
      opts = merge(opts, {
          type: 'Border',
          collides_with: ['Sheep'],
          handleEvents: false,
          ignoreSubviews: true,
          backgroundColor: '#FFFFFF',
          opacity: 0.5,
          collision_shape: Rect
      });
      supr(this, 'init', [opts]);
    };

    this.getCollisionShape = function(entityType) {
      if (this.collision_shape) {
        var x = this.style.x;
        var y = this.style.y;
        var shape = new this.collision_shape(x, y, this.style.width, this.style.height);
        return shape;
      }
      return null;
    };

    this.collidesWith = function(entity) {
      return;
    };

});