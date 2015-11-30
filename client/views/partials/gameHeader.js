Template.gameHeader.helpers({
	initialTime: function() {
		return SessionAmplify.get('userStageTime');
	},

	score: function() {
		var userProfile = Meteor.user().profile;
		return userProfile.game ? userProfile.game.score : 0;
	},

	clues: function() {
		return 0
	}
});
