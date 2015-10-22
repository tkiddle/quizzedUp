Meteor.methods({
	'upsertQuestion': function(docQuery, upsertFields) {

		// Upserts are not allowed on the client so a Meteor method is called.
		check(docQuery, Object);
		check(upsertFields, Object);

		Questions.update(docQuery, upsertFields, { upsert: true }, function(err, doc) {

			if(err) {
				console.log(err);
				return false;
			}

			return true;
		});
	},

	'registeredUserCount': function() {
		return Meteor.users.find().count();
	},

	'averageDifficulty': function() {
		var questionCursor = Questions.find({}, { fields: { difficulty: 1 } }),
				questionCount = questionCursor.count(),
				questions = questionCursor.fetch(),
				difficultyTotal = 0;

		_.each(questions, function(doc) {
			difficultyTotal += parseFloat(doc.difficulty);
		});

		return difficultyTotal / questionCount;
	},

	/**
	 * Remove the game document and set all users profile.game obj to an empty obj
	 */
	'resetGame': function() {

		var users = Meteor.users.find({ 'profile.role': 'player' }).fetch();

		_.each(users, function(doc,  i) {

			Meteor.users.update({_id: doc._id, 'profile.role': 'player' }, {
				'$set': {
					'profile.game': {
						score: 0
					}
				}

			}, function(err, doc) {

				if(err) {
					// New message!
					console.log(err, 'Could not update users!');
				}
			});
		});

		Game.remove({}, function(err, docs) {
			if(err) {
				// New message!
				console.log('Could not remove all games!');
			}
		});

		var questions, questionsArray, count;

		questions = Questions.find().fetch();

		questionsArray = [];
		count = 1;

		_.each(questions, function (doc, i) {
			questionsArray.push({
				questionId: doc._id,
				time: doc.time,
				question: doc.question,
				answer: doc.answer,
				stage: count++,
				played: false
			});
		});

		/**
		 * Randomize array element order in-place.
		 * Using Durstenfeld shuffle algorithm.
		 */
		function shuffleArray(array) {
			for (var i = array.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
			return array;
		}

		questionsArray = shuffleArray(questionsArray);

		Game.insert({
			current: true,
			questions: questionsArray
		}, function(err, doc) {

			if(err) {
				// New message
				console.log(err);
			}
		});

	},

	'markStageAsPlayed': function(game, stage) {

		Game.update({
			_id: game._id, 'questions.questionId': stage._id },
			{ '$set': { 'questions.$.played': true }
		}, function(err, doc){

			if(err) {
				// New message!
				console.log('Could not mark stage as played!');
			}
		});

		/**
			 Meteor.call('markStageAsPlayed', game, currentStage, function(err, data) {
				if(err) {
					// New message!
					console.log('Could not mark stage as played!');
				}
				return true;
			});
		*/
	},

	'deleteAllPlayers': function() {
		Meteor.users.remove({'profile.role': 'player'}, function(err, num){
			if(err) {
				console.log(err);
				return err;
			}

		});
	}
});
