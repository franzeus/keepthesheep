import ui.StackView as StackView;
import device;
import src.view.IntroView as IntroView;
import src.view.GameView as GameView;
import src.view.GameLoseView as GameLoseView;

/*
  animate.linear —Animation has the same speed from start to finish.
  animate.easeIn —Animation has a slow start.
  animate.easeOut —Animation has a slow end.
  animate.easeInOut —Animation has both slow start and slow end.
*/

exports = Class(GC.Application, function () {
	var rootView = null;
  var boundsWidth = 576;
  var boundsHeight = 1024;
  var currentView = null;

  var baseWidth = device.screen.width * (boundsHeight / device.screen.height); //864
  var baseHeight = boundsHeight; //576
  var scale = device.screen.height / baseHeight; //1

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
    if (currentView === view.name) {
      return false;
    }
    currentView = view.name;
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

  device.setBackButtonHandler(function() {
    addIntroView();
  });

	/**
	 * Listen for an event dispatched by the title screen when
	 * the start button has been pressed. Hide the title screen,
	 * show the game screen, then dispatch a custom event to the
	 * game screen to start the game.
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
