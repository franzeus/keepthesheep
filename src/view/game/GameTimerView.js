/**
 * GameTimerView
 * @author: webarbeit@gmail.com
 * TextView to show elapsed time
 */

 // TODO: User ScoreView instead
 // http://docs.gameclosure.com/example/text-scoreview/

import device;
import ui.TextView;
import math.util as util;
import src.engine.Queue as Queue;

exports = Class(ui.TextView, function (supr) {
  this.name = 'GameTimerView';
  this.countup = null;
  this.doCount = false;
  this.countSeconds = 0;

  this.init = function (opts) {
    opts = merge(opts, {
      visible: true,
      clip: true,
      width: opts.width || 100,
      height: opts.height || 80,
      size: 80,
      color: '#fff'
    });
    supr(this, 'init', [opts]);
    this.queue = new Queue(this);
  };

  this.tick = function() {
    this.queue.workQueue();
  };

  this.reset = function() {
    this.stopCount();
    this.setText('00:00');
    this.countSeconds = 0;
  };

  this.getElapsedSeconds = function() {
    return this.countSeconds;
  };

  this.startCount = function() {
    this.doCount = true;
    this.setText('00:00');
    this.increaseCounter();
  };

  this.stopCount = function() {
    this.doCount = false;
    this.queue.removeAllTasks('increaseCounter');
  };

  this.increaseCounter = function() {
    var zero = function(num) {
      return num < 10 ? '0' + num : num;
    };
    var current = this.countSeconds;
    var minutes = Math.floor(current / 60);
    var seconds = current - (minutes * 60);
    var formated = zero(minutes) + ':' + zero(seconds);
    this.setText(formated);

    this.countSeconds++;
    if (this.doCount) {
      this.queue.add('increaseCounter', 1000);
    }
  };

});