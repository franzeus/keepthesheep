/**
 * Queue
 * @author: webarbeit@gmail.com
 * Queue for dispatching scheduled events
 */
import math.util as util;

exports = Class(function () {

  this.init = function (source) {
    this.source = source;
    this.queue = [];
  };

  this.reset = function() {
    this.queue = [];
  };

  /**
   * @param {String} fnName - The function name to call this[fnName]
   * @param {Array|Number} delay - The delay in miliseconds. Pass Array for random range [2000, 5000]
   * @param {Object} params - Optional param object we want to pass to the fnName
   */
  this.add = function(fnName, delay, params) {
    var params = params || {};
    // We can pass a delay range, if we want random delay
    if (delay.hasOwnProperty('length')) {
      delay = util.random(delay[0], delay[1]);
    } else {
      delay = delay || 0;
    }
    var triggerTs = +(new Date());
    if (delay) {
      triggerTs += delay;
    }
    var q = {
      triggerTs: triggerTs,
      emitted: false,
      fnName: fnName,
      params: params
    };
    this.queue.push(q);
  };

  this.workQueue = function() {
    var now = +(new Date());
    var len = this.queue.length;
    for (var i = 0; i < len; i++) {
      var q = this.queue[i];
      if (q.triggerTs <= now && !q.emitted) {
        this.emitQueueItem(q);
      }
    }
    this.cleanUp();
  };

  this.emitQueueItem = function(q) {
    if (typeof this.source[q.fnName] === 'function' && !q.emitted) {
      this.source[q.fnName].call(this.source, q.params);
      q.emitted = true;
    } else {
      console.warn('Queue: Object has no method ' + q.fnName);
    }
  };

  /**
   * Removes all queue items with specified fnName
   * @param {String} fnName - The function name
   */
  this.removeAllTasks = function(fnName) {
    for (var i = this.queue.length - 1; i >= 0; i--) {
      var q = this.queue[i];
      if (q.fnName === fnName) {
        this.queue.splice(i, 1);
      }
    }
  };

  /**
   * @param {Array} itemsToRemove - List of indexes with items to remove
   */
  this.cleanUp = function(itemsToRemove) {
    if (itemsToRemove && itemsToRemove.length) {
      for (var i = 0; i < itemsToRemove.length; i++) {
        this.queue.splice(itemsToRemove[i], 1);
      }
    } else {
      for (var i = 0; i < this.queue.length; i++) {
        if (this.queue[i].emitted) {
          this.queue.splice(i, 1);
        }
      }
    }

  };

});
