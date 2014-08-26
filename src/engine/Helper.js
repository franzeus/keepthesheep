import math.util as util;
import animate;
import math.geom.Vec2D as Vec2D;
import math.geom.Line as Line;
import math.geom.Rect as Rect;

exports = Class(function () {

  this.init = function () {};

  this.getRandomRectEdgePoints = function(x, y, width, height) {
    var areaRect = new Rect(x, y, width, height);
    // Recommended Rect.SIDES does not work, but they represent numbers for each side (top, left ...)
    // 1: top, 2: bottom, 3: left, 4: right
    var side = util.random(1, 4);
    var edge = areaRect.getSide(side);
    return [edge.start, edge.end];
  };

  this.getInverseDirectionTo = function(x1, y1, x2, y2, distance, maxAngle) {
    var v = new Vec2D({ x: x1, y: y1 });
    var b = new Vec2D({ x: x2, y: y2 });
    var directionVec = b.minus(v);
    var angle = directionVec.getAngle();
    var maxAngle = maxAngle === undefined ? 0 : maxAngle;
    var randAngle = util.random(angle - maxAngle, angle + maxAngle);
    var x = x1 + Math.cos(randAngle) * distance;
    var y = x2 + Math.sin(randAngle) * distance;
    return {x: x, y: y};
  };

});
