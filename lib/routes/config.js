Router.configure({
	layoutTemplate: 'layout',
	waitOn: function() {
		return [
			Meteor.subscribe('questions'),
			Meteor.subscribe('game'),
		]
	}
});

Router.onBeforeAction(function(){

	/**
	 * Anonymous users should not be able to view admin or game pages
	 */

	if(!(Meteor.user())) {
		this.redirect('preJoin');
	}

	this.next();

}, {
	except: ['join', 'preJoin', 'login', 'leaderboard']
});


Router.onBeforeAction(function() {

	/**
		* Logged in users should not be able to access the join or login pages
		*/

	var currentUser = Meteor.user(),
			currentUserType;

	if(currentUser) {
		currentUserType = currentUser.profile.role;
		if(currentUserType == 'admin') {
			this.redirect('admin');
		} else {
			this.redirect('game');
		};
	}

	this.next();

}, {
	only: ['join', 'preJoin', 'login']
});


Router.onBeforeAction(function() {

	/**
	 * If the current user is not an admin deny access to the admin pages
	 */

	var currentUser = Meteor.user(),
			currentUserType;

	if(currentUser) {
		currentUserType = currentUser.profile.role;
		if(currentUserType != 'admin') {
			this.redirect('game');
		};
	}

	this.next();

}, {
	only: ['admin', 'questions', 'questionsEdit', 'questionsAdd', 'gameControl', 'users', 'usersEdit']
});
