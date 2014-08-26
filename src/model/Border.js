import src.model.Entity as Entity;
import math.geom.Rect as Rect;

exports = Class(Entity, function (supr) {

    this.init = function (opts) {
      opts = merge(opts, {
          type: 'Border',
          handleEvents: false,
          ignoreSubviews: true,
          backgroundColor: opts.backgroundColor || '#FFFFFF',
          opacity: opts.opacity || 1
      });
      supr(this, 'init', [opts]);
      this.isGhost = opts.isGhost || false;
      this.collides_with = [];
      this.collision_shape = Rect;
      this.collision_shapes = [['body', Rect, 1]];
    };

    this.getCollisionShape = function(collisionShape) {
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
