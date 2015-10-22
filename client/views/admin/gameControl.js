Template.gameControl.rendered = function(){
	$('body').addClass('admin-page');

	Streamy.on('end-game', function() {
		$('#game-control-reset').removeClass('disabled');
	});

	ADMIN_GAME_CONTROLS.init();
}

Template.gameControl.destroyed = function(){
	$('body').removeClass('admin-page');
}

Template.gameControl.helpers({
	'buildGameAllowed': function() {
		var question = Questions.findOne({});
		return question ? true : false;
	},

	'stageNo': function() {
		return SessionAmplify.get('stageNo') + '/' +  SessionAmplify.get('totalStages');
	},

	'gameNotReady': function() {
		var game = Game.findOne({});
		return game ? false : true;
	},

	'gameNotOver': function() {
		return !SessionAmplify.get('gameOver');
	},
	'currentGameStage': function() {
		return Game.findOne();
	}
});

Template.gameControl.events({
	'click #game-control-reset:not(".disabled"), click #game-control-build': function(e) {
		Meteor.call('resetGame', function(err) {
			if(err) {
				// New message
				console.log('There has been a problem with reseting the game!');
			}

			Streamy.broadcast('reset-game', {});

			window.location.reload();

		});
	},

	'click #game-control-play': function(e) {
		e.preventDefault();

		$(e.target).addClass('h-hidden');
		$('#game-control-reset').addClass('disabled');
		$('#game-control-pause').removeClass('h-hidden');
		$('.admin-nav__lights').addClass('admin-nav__lights--active');

		Streamy.broadcast('play-game', {});

		Streamy.on('play-game', function() {
			ADMIN_GAME_CONTROLS.startTimer();
			$('#game-control-pause').removeClass('game-control__next');
		});
	},

	'click #game-control-pause': function(e) {
		e.preventDefault();

		$(e.target).addClass('h-hidden');
		$('#game-control-reset').removeClass('disabled');
		$('#game-control-play').removeClass('h-hidden');
		$('.admin-nav__lights').removeClass('admin-nav__lights--active');

		Streamy.broadcast('pause-game', {});

		Streamy.on('pause-game', function() {
			ADMIN_GAME_CONTROLS.updateUi();
			ADMIN_GAME_CONTROLS.stopTimer();

			if(!ADMIN_GAME_CONTROLS.currentGame.over) {
				SessionAmplify.set('stageNo', (SessionAmplify.get('stageNo') + 1));
			}
		});
	},
});




