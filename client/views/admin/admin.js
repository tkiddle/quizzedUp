Template.admin.rendered = function(){
	$('body').addClass('admin-page');
}

Template.admin.destroyed = function(){
	$('body').removeClass('admin-page');
}

Template.admin.helpers({
	'totalQuestions': function() {
		return Questions.find().count();
	},

	'totalPlayers': function() {
		return Meteor.users.find().count();
	},

	'averageDifficulty': function() {
		var questionCursor = Questions.find({}, { fields: { difficulty: 1 } }),
				questionCount = questionCursor.count(),
				questions, difficultyTotal;
				difficultyTotal = 0;

		if(questionCount) {
			questions = questionCursor.fetch(),
			_.each(questions, function(doc) {
				difficultyTotal += parseFloat(doc.difficulty);
			});
			return parseFloat(difficultyTotal / questionCount).toFixed(1);
		} else {
			return difficultyTotal;
		}
	},

	'totalTime': function() {
		var questionCursor = Questions.find({}, { fields: { time: 1 } }),
				questions = questionCursor.fetch(),
				totalTime = 0;

		_.each(questions, function(doc) {
			totalTime += parseFloat(doc.time);
		});

		return parseFloat(totalTime);
	}
});
