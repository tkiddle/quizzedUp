Router.route('/admin', {
	name: 'admin',
	template: 'admin',
	fastRender: true,
	waitOn: function() {
		return [
			Meteor.subscribe('players'),
		]
	}
});

Router.route('/admin/questions', {
	name: 'questions',
	template: 'questions',
	fastRender: true,
});

Router.route('/admin/questions/add', {
	name: 'questionsAdd',
	template: 'inputQuestion',
	data: { isNewQuestion: true },
	fastRender: true,
});

Router.route('/admin/questions/edit/:_id', {
	name: 'questionsEdit',
	template: 'inputQuestion',
	data: function() {
		return Questions.findOne({ _id: this.params._id });
	},
	fastRender: true,
});

Router.route('/admin/users', {
	name: 'users',
	template: 'users',
	fastRender: true,
	waitOn: function() {
		return [
			Meteor.subscribe('allUsers'),
		]
	}
});

Router.route('/admin/users/add', {
	name: 'userAdd',
	template: 'inputUser',
	data: { isNewUser: true },
	fastRender: true,
	waitOn: function() {
		return [
			Meteor.subscribe('allUsers'),
		]
	}
});

Router.route('/admin/users/edit/:_id', {
	name: 'userEdit',
	template: 'inputUser',
	data: function() {
		return Meteor.users.findOne({ _id: this.params._id });
	},
	fastRender: true,
	waitOn: function() {
		return [
			Meteor.subscribe('allUsers'),
		]
	}
});

Router.route('/admin/gamecontrol', {
	name: 'gameControl',
	template: 'gameControl',
	fastRender: true,
});
