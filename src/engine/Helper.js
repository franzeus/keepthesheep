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
    var side = util.random(1, 4);
    var edge = areaRect.getSide(side);
    return [edge.start, edge.end];
  };

});
