Router.route('/logout', {
	name: 'logout',
	fastRender: true,
	onBeforeAction: function() {
		Meteor.logout();
		this.redirect('/');
		this.next();
	},
	waitOn: function() {
		return [
			Meteor.subscribe('allUsers'),
		]
	}
});

Router.route('/login', {
	name: 'login',
	fastRender: true,
	template: 'login',
	waitOn: function() {
		return [
			Meteor.subscribe('allUsers'),
		]
	}
});

