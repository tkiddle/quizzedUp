Meteor.methods({

	'averageDifficulty': function() {

		var questionCursor = Questions.find({}, { fields: { difficulty: 1 } }),
				questionCount = questionCursor.count(),
				questions = questionCursor.fetch(),
				difficultyTotal = 0;

		_.each(questions, function(doc) {
			difficultyTotal += parseFloat(doc.difficulty);
		});

		return difficultyTotal / questionCount;
	}

});
