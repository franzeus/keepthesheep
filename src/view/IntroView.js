import device;
import ui.View;
import ui.TextView;

/**
 * IntroView
 * @author: webarbeit@gmail.com
 * This is the first view the user sees when he starts the app
 */

exports = Class(ui.View, function (supr) {
  var startbutton = null;
  var centerX = 0;
  var centerY = 0;

  this.init = function (opts) {
    opts = merge(opts, {
      backgroundColor: '#5049A1',
      clip: true
    });
    this.name = 'IntroView';
    supr(this, 'init', [opts]);
    centerX = opts.width / 2;
    centerY = opts.height / 2;
    this.addStartButton();
  };

  this.addStartButton = function() {
    var w = 750;
    var h = 150;
    var cx = centerX - (w / 2);
    var cy = centerY - (h / 2);
    startbutton = new ui.TextView({
      superview: this,
      visible: true,
      x: cx,
      y: cy,
      width: w,
      height: h,
      size: 210,
      color: '#ffffff'
    });
    startbutton.setText('KEEP THE SHEEP');

    var subtext = new ui.TextView({
      superview: this,
      visible: true,
      x: cx,
      y: cy + 130,
      width: w,
      height: h,
      size: 40,
      color: '#ffffff'
    });
    subtext.setText('TAP TO START GAME');

    this.on('InputSelect', bind(this, function () {
      this.emit('introView:start');
    }));
  };
});
