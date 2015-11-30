/**
 * MONOLITHIC OBJECT ALERT! The GAME_CONTROLS object and the methods within it
 * Is where the majority of the logic behind the game lives (as far as a player
 * Is concerened). The GAME_CONTROLS object handles UI updates, player scores,
 * Timer start/stop and rendering stages/questions.
 */

GAME_CONTROLS = {

	useSoundFx: true,
	stageTime: undefined,
	stageType: undefined,
	currentTime: undefined,
	currentStageTpl: undefined,
	countDownInterval: undefined,
	stageStartTS: undefined,
	stageAnsweredTS: undefined,

	updateUI : function(score, ele) {

		this.stopTimer();

		$('span', '.game-stats__score').eq(0).append($('<div>', {
			'id': 'score-up-score',
			'class': 'score-up-score',
			'text': score
		}));

		Meteor.setTimeout(function() {
			$('#score-up-score').addClass('score-up-score--active');
		}, 200);

		if(this.stageType == 'multichoice') {

			if(ele) {
				if(score > 0) {

					if(this.useSoundFx) {
						window.winBuzzer.play();
					}

					$(ele.target).append($('<div>', {
						'id': 'score-up-answer',
						'class': 'score-up-answer',
						'text': score
					}));

					Meteor.setTimeout(function() {
						$('#score-up-answer').addClass('score-up-answer--active');
					}, 200);

					$(ele.target).addClass('correct');

				} else {

					if(this.useSoundFx) {
						window.failBuzzer.play();
					}

					$(ele.target).append($('<div>', {
						'id': 'score-up-answer',
						'class': 'score-up-answer score-up-answer--incorrect',
						'text': score
					}));

					Meteor.setTimeout(function() {
						$('#score-up-answer').addClass('score-up-answer--active');
					}, 200);

					$(ele.target).addClass('incorrect');
				}
			} else {

				if(this.useSoundFx) {
					window.failBuzzer.play();
				}

				$('.multichoice-list').addClass('unanswered');
				console.log('you didnt select anything');
			}

		} else {

			if(ele && ele.val()) {

				if(score > 0) {

					if(this.useSoundFx) {
						window.winBuzzer.play();
					}

					$('#wordfill-submit').append($('<div>', {
						'id': 'score-up-answer',
						'class': 'score-up-answer',
						'text': score
					}));

					Meteor.setTimeout(function() {
						$('#score-up-answer').addClass('score-up-answer--active');
					}, 200);

					ele.addClass('correct');

				} else {


					if(this.useSoundFx) {
						window.failBuzzer.play();
					}

					$('#wordfill-submit').append($('<div>', {
						'id': 'score-up-answer',
						'class': 'score-up-answer score-up-answer--incorrect',
						'text': score
					}));

					Meteor.setTimeout(function() {
						$('#score-up-answer').addClass('score-up-answer--active');
					}, 200);

					ele.addClass('incorrect');

				}

			} else {
				$('.wordfill-stage').addClass('unanswered');

				if(this.useSoundFx) {
					window.failBuzzer.play();
				}

				console.log('you didnt select anything');
			}
		}
	},

	endStage: function(answer, ele) {

		var that = this,
				game;

		if(answer){
			answer = answer.trim().toLowerCase();
		}

		Meteor.clearInterval(this.countDownInterval);

		if(this.stageType == 'multichoice') {

			var $ele = $(ele);

			if(ele && answer == $(ele.target).text().toLowerCase().trim()) {

				// If the answer is correct lets calculate the score
				score = this.calculateScore();
			} else {

				// If the answer is incorrect the score is zero
				score = 0;
			}
		} else {
			if(ele && answer == ele.val().toLowerCase().trim()) {

				// If the answer is correct lets calculate the score
				score = this.calculateScore();
			} else {

				// If the answer is incorrect the score is zero
				score = 0;
			}
		}

		if(score > 0) {
			this.updateUsersScore(score);
		}

		game = SessionAmplify.get('usersGame');

		for(var i = 0, len = game.questions.length; i < len; i++) {

			if(i == len - 1) {
				game.over = true;
				break;
			}

			if(game.questions[i].played == false) {
				game.questions[i].played = true;
				break;
			}

		}

		SessionAmplify.set('usersGame', game);

		this.updateUI(score, ele);

		SessionAmplify.set('userStageEnded', true);

		// Meteor.setTimeout(function() {
			/**
			 *  RENDER STAGE HAS BEEN COMMENTED OUT SO THAT STAGES ARE NOT AUTOMATICALLY
			 *  RENDERED AS SOON AS A USERS FINISHES A QUESTIONS. THIS ALLOWS ADMINS TO CONTROL
			 *  THE GAME LIKE A GAME SHOW HOST.
			 */

			//that.renderStage();
		// }, 4000);

	},

	/**
	 * A correct answer, answered within 2 seconds will fetch the full 20 points
	 * For every subsequent 2 seconds, 2 points is reduced from the initial 20 seconds
	 * A wrong anser carries no points
	 * @return {[type]} [description]
	 */
	calculateScore: function() {
		var that = this,
				totalStagePoints = this.stageTime * 2,
				userScore, timeSpent;

		timeSpent = this.stageTime - this.currentTime;

		var timestampDiff = (this.stageAnsweredTS - this.stageStartTS);

		if(timestampDiff <= 250) {
		// If answered within quater of a second
			userScore = totalStagePoints + 4;
		} else if(timestampDiff <= 500) {
		// If answered within half of a second
			userScore = totalStagePoints + 2;
		} else if(timestampDiff <= 750) {
			// If answered within three quaters of a second
			userScore = totalStagePoints + 1;
		} else {
			userScore = totalStagePoints - timeSpent;
		}

		var debug = [{
					'Stage time allowance': that.stageTime,
					'Time spent': timeSpent,
					'Time remaining': that.currentTime,
					'Max score': totalStagePoints,
					'User score': userScore
				}];

		console.table(debug);

		return userScore;
	},

	updateUsersScore: function(score) {

		Meteor.users.update({_id: Meteor.userId()}, {
			'$inc': {
				'profile.game.score': score
			}
		});

	},

	stopTimer : function() {
		var $countDownBar = $('.countdown-bar__inner', '#countdown-bar'),
				currentBarPosition = $countDownBar.css('width');

		$countDownBar.css('width', currentBarPosition);

		Meteor.clearInterval(this.countDownInterval);
	},

	startTimer: function() {

		var that = this;

		SessionAmplify.set('userStageEnded', false);
		if(!SessionAmplify.get('userStageTime') || SessionAmplify.get('userStageTime') <= 0) {

			this.currentTime = this.stageTime;
			SessionAmplify.set('userStageTime', this.currentTime);
		} else {
			this.currentTime = SessionAmplify.get('userStageTime');
		}



		$('.countdown-bar__inner', '#countdown-bar')
			.attr('style', 'transition: width ' + SessionAmplify.get('userStageTime') + 's linear;');

		Meteor.setTimeout(function() {

			that.stageStartTS = new Date().getTime();

			$('.countdown-bar__inner', '#countdown-bar').css('width', '0%');

			that.countDownInterval = Meteor.setInterval(function() {
				that.currentTime--;
				SessionAmplify.set('userStageTime', that.currentTime);

				if(that.currentTime < 0) {
					SessionAmplify.set('userStageTime', 0);
					that.endStage(null, null);
				} else {
					//$('#counter').text(that.currentTime);
				}
			}, 1000);

		}, 100);
	},

	createUsersGame: function() {

		if(!SessionAmplify.get('usersGame')) {
			SessionAmplify.set('status', 'waiting');
			SessionAmplify.set('usersGame', Game.findOne({ current: true }));
		} else {
			if(SessionAmplify.get('status') != 'waiting' && SessionAmplify.get('status') != 'preparing') {
				this.renderStage();
			}
		}
	},

	resetUsersGame: function(cb) {
		SessionAmplify.set('usersGame', null);
		this.createUsersGame();
	},

	renderStage: function() {

		var that = this,
				game = game = SessionAmplify.get('usersGame');

		if(this.currentStageTpl) {
			Blaze.remove(that.currentStageTpl);
		}

		if(!game.over) {

			for(var i = 0, len = game.questions.length; i < len; i++) {
				if(game.questions[i].played == false) {
					that.currentQuestion = game.questions[i];
					break;
				}
			}

			that.currentQuestion = Questions.findOne(that.currentQuestion.questionId);

			SessionAmplify.set('status', 'play');
			that.stageTime = that.currentQuestion.time;

			if(that.currentQuestion.type == 'multichoice') {
				that.currentStageTpl = Blaze.renderWithData(Template.multichoice, that.currentQuestion, document.getElementById('stage'));
			} else {
				that.currentStageTpl = Blaze.renderWithData(Template.wordfill, that.currentQuestion, document.getElementById('stage'));
			}
			if(SessionAmplify.get('userStageEnded')) {
				SessionAmplify.set('userStageTime', that.stageTime);
			}

			that.startTimer();
		} else {

			var user = Meteor.user();

			SessionAmplify.set('finalScore', user.profile.game.score);

			SessionAmplify.set('status', null);
		}
	},

	init: function() {

		var that = this;

		if(SessionAmplify.get('userStageEnded') == true) {
			SessionAmplify.set('status', 'preparing');
		}

		if(SessionAmplify.get('userStageTime') && !SessionAmplify.get('userStageTime') <= 2 ) {
			SessionAmplify.set('userStageTime', SessionAmplify.get('userStageTime') - 1);
		}

		this.createUsersGame();

		/**
		 * When game play beings we find the latest built game and push the first
		 * Stage to all users. The count down for that round beings immediately
		 */
		Streamy.on('play-game', function() {
			that.renderStage();
		});

		/**
		 * When game play is paused we stop all countdown timers and show
		 * The waiting screen to all users.
		 */
		Streamy.on('pause-game', function(d, s) {
			SessionAmplify.set('status', 'preparing');

			Meteor.clearInterval(that.countDownInterval);

			if(that.currentStageTpl){
				Blaze.remove(that.currentStageTpl);
			}

			SessionAmplify.set('userStageTime', that.stageTime);
		});

		Streamy.on('end-game', function(d, s) {
			Meteor.clearInterval(that.countDownInterval);
			Blaze.remove(that.currentStageTpl);
			SessionAmplify.set('status', 'ended');
		});

		Streamy.on('reset-game', function() {
			that.resetUsersGame();
			SessionAmplify.set('finalScore', null);
			SessionAmplify.set('usersGame', null);
			SessionAmplify.set('gameOver', false);
			SessionAmplify.set('userStageTime', null);
			SessionAmplify.set('userStageEnded', null);
			SessionAmplify.set('status', 'waiting');
			window.location.reload();
		});
	}
}
