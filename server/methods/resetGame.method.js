Meteor.methods({

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
					console.log(err, 'Could not update users!');
				}
			});
		});

		Game.remove({}, function(err, docs) {
			if(err) {
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
		 * Randomize array elements using Durstenfeld shuffle algorithm.
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
				console.log(err);
			}
		});

	}

});
