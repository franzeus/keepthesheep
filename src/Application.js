/**
 * @author: webarbeit
 * Init and handling different views
 */
import ui.StackView as StackView;
import device;
import src.view.IntroView as IntroView;
import src.view.GameView as GameView;
import src.view.GameLoseView as GameLoseView;

exports = Class(GC.Application, function () {
	var rootView = null;
  var boundsWidth = 576;
  var boundsHeight = 1024;
  var currentViewName = null;

  var baseWidth = device.screen.width * (boundsHeight / device.screen.height);
  var baseHeight = boundsHeight;
  var scale = device.screen.height / baseHeight;

  var introView = new IntroView({
    x: 0,
    y: 0,
    width: baseWidth,
    height: baseHeight
  });

  var gameView = new GameView({
    x: 0,
    y: 0,
    width: baseWidth,
    height: baseHeight
  });

  var gameLoseView = new GameLoseView({
    x: 0,
    y: 0,
    width: baseWidth,
    height: baseHeight
  });

	this.initUI = function () {
		rootView = new StackView({
	    superview: this,
	    x: 0,
	    y: 0,
	    width: baseWidth,
	    height: baseHeight,
	    clip: true,
	    backgroundColor: '#F83737'
		});
    this.view.style.scale = scale;

    addIntroView();
	};

  var setCurrentView = function(view) {
    if (currentViewName === view.name) {
      return false;
    }
    currentViewName = view.name;
    rootView.push(view);
    return true;
  };

	var addIntroView = function() {
    setCurrentView(introView);
	};

	var addGameView = function() {
    if (setCurrentView(gameView)) {
      gameView.start();
    }
  };

  var addGameLoseView = function(data) {
    gameLoseView.setMessages(data);
    setCurrentView(gameLoseView);
  };

  /**
   * Listen for an event dispatched by the device back button
   */
  device.setBackButtonHandler(function() {
    addIntroView();
  });

	/**
	 * Listen for an event dispatched by the stacked views
	 */
  introView.on('introView:start', function () {
    addGameView();
  });

  gameView.on('gameView:end', function(data) {
    addGameLoseView(data);
  });

  gameLoseView.on('gameLoseView:end', function() {
    addIntroView();
  });

	this.launchUI = function () {};
});
