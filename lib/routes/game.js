Router.route('/game', {
	name: 'game',
	fastRender: true,
});

Router.route('/leaderboard', {
	name: 'leaderboard',
	fastRender: true,
	waitOn: function() {
		return [
			Meteor.subscribe('playersRanks'),
		]
	}
});
