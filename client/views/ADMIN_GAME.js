/**
 * MONOLITHIC OBJECT ALERT! The ADMIN_GAME_CONTROLS object and the methods
 * Within It is where the majority of the logic lives for the game from the
 * Admin/quizmasters perspective.
 */

ADMIN_GAME_CONTROLS = {

currentGame: undefined,
currentQuestion: undefined,
currentTimer: undefined,

	setGame: function() {
		var game = Game.findOne();
		this.currentGame = game;
		SessionAmplify.set('stageNo', 1);
		SessionAmplify.set('totalStages', this.currentGame.questions.length);
		this.setQuestion();
	},

	setQuestion: function() {
		var questions = this.currentGame.questions;

		for(var i = 0, len = questions.length; i < len; i++) {
			if(!questions[i].played) {
				this.currentQuestion = questions[i];
				break;
			}
		}
	},

	endStage: function() {
		var questions = this.currentGame.questions;

		Meteor.clearInterval(this.currentTimer);
		$('#game-control-pause').addClass('game-control__next');

		for(var i = 0, len = questions.length; i < len; i++) {
			if(i == len - 1) {

				console.log('GAME OVER!');
				this.currentGame.over = true;
				break;
			}

			if(questions[i].played == false) {
				questions[i].played = true;
				break;
			}
		}

		if(!this.currentGame.over) {
			this.setQuestion();

		} else {

			Meteor.setTimeout(function() {
				SessionAmplify.set('gameOver', true);
				Streamy.broadcast('end-game', {});
			}, 4000);

			$('#admin-timer').text('The game is over!');
		}

		//this.updateUi();

		console.log(this.currentGame);
	},

	updateUi: function() {
		if(!this.currentGame.over) {
			$('#admin-timer').text(this.currentQuestion.time);
			$('#admin-current-answer').text(this.currentQuestion.answer);
			$('#admin-current-question').text(this.currentQuestion.question);
		}
	},

	startTimer: function() {

		var	that = this,
				time = this.currentQuestion.time;

		if(!this.currentGame.over) {

			$('#admin-timer').text(time);

			Meteor.setTimeout(function() {

				that.currentTimer = Meteor.setInterval(function(){
					time--;

					if(time < 0) {
						that.endStage();
					} else {
						$('#admin-timer').text(time);
					}

				}, 1000);

			}, 100);
		}
	},

	stopTimer: function() {
		$('#admin-timer').text(this.currentQuestion.time);
		Meteor.clearInterval(this.currentTimer);
	},

	init: function() {
		SessionAmplify.set('gameOver', false);

		this.setGame();
		this.updateUi();

		$('#admin-timer').text(this.currentQuestion.time);

		console.log(this);
	}
}
