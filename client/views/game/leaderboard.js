Template.leaderboard.rendered = function() {
	$('body').addClass('leaderboard-page');
}

Template.leaderboard.destroyed = function(){
	$('body').removeClass('leaderboard-page');
}

Template.leaderboard.helpers({
	'users': function() {
		return Meteor.users.find({}, { sort: { 'profile.game.score': -1 } });
	}
});
