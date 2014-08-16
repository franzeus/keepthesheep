/**
 * GameLoseVIew
 * @author: webarbeit@gmail.com
 * This is the view the users sees when he loses the game
 */

import device;
import ui.View;
import ui.TextView;
import math.util as util;

exports = Class(ui.View, function (supr) {
  this.message = null;
  this.timerText = null;
  var centerX = 0;
  var centerY = 0;
  var teaserLow = [
    "Man - you had one job!",
    "Thank god they are not real!",
    "Sheepsitting is not your thing :P",
    "Oh boy, not even 60 seconds?! :P"
  ];
  var teaserMiddle = [
    'Not bad, but can you do better?!',
    'That was OOOOVER a minute!!!'
  ];
  var teaserHigh = [
    'Wauuuuuuuu',
    'Good work!'
  ];

  this.init = function (opts) {
    opts = merge(opts, {
      backgroundColor: '#FF676B',
      clip: true
    });
    this.name = 'GameLoseView';
    supr(this, 'init', [opts]);
    centerX = opts.width / 2;
    centerY = opts.height / 2;
    this.addText('GAME OVER!');
    this.on('InputSelect', bind(this, function () {
      this.emit('gameLoseView:end');
    }));
  };

  this.setMessages = function(data) {
    this.setTimer(data.timeAsString);
    var teaserList = [];
    if (data.time < 60) {
      teaserList = teaserLow;
    } else if (data.time < 300) {
      teaserList = teaserMiddle
    } else {
      teaserList = teaserHigh
    }

    var randIndex = util.random(0, teaserList.length - 1);
    var randTeaser = teaserList[randIndex];
    this.setTeaser(randTeaser);
  };

  this.addText = function(message) {
    if (!this.message) {
      var w = 750;
      var h = 250;
      var cx = centerX - (w / 2);
      var cy = 50;
      this.message = new ui.TextView({
        superview: this,
        visible: true,
        x: cx,
        y: cy,
        width: w,
        height: h,
        size: 210,
        color: '#ffffff'
      });
    }
    this.message.setText(message);
  };

  this.setTeaser = function(message) {
    if (!this.teaserMessage) {
      var w = 750;
      var h = 150;
      var cx = centerX - (w / 2);
      var cy = 800;
      this.teaserMessage = new ui.TextView({
        superview: this,
        visible: true,
        x: cx,
        y: cy,
        width: w,
        height: h,
        size: 130,
        color: '#ffffff'
      });
    }
    this.teaserMessage.setText(message);
  };

  this.setTimer = function(msg) {
    if (!this.timerText) {
      var w = 850;
      var h = 350;
      var cx = (centerX - w);
      var cy = centerY - h;
      this.timerText = new ui.TextView({
        superview: this,
        visible: true,
        x: cx,
        y: cy,
        width: w,
        height: h,
        scale: 2,
        size: 180,
        color: '#fff'
      });
    }
    this.timerText.setText(msg);
  };
});
