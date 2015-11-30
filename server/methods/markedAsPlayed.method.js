Meteor.methods({

	'markStageAsPlayed': function(game, stage) {

		Game.update({
			_id: game._id, 'questions.questionId': stage._id },
			{ '$set': { 'questions.$.played': true }
		}, function(err, doc){

			if(err) {
				console.log('Could not mark stage as played!');
			}
		});
	}

});
