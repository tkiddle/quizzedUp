Template.inputUser.destroyed = function(){
	$('body').removeClass('admin-page');
}

Template.inputUser.rendered = function() {

	var role = Template.currentData().profile.role,
			ROLES = ['admin', 'player'];

	$('body').addClass('admin-page');

	for(var i = 0; i < ROLES.length; i++) {
		Blaze.renderWithData(Template.userRoleOptions, {
			value: ROLES[i],
			selected: (role == ROLES[i])
		}, $('#role')[0]);
	}

};

Template.inputUser.events({
	'submit #user-edit-form': function (e) {
		e.preventDefault();

		Meteor.users.update({ _id: Template.currentData()._id }, {
			'$set': {
				'profile.role': $('#role').val()
			}
		}, function(err){
			if(err) {
				// New Message
				console.log(err);
			}
			// New Message
			Router.go('users');
		});
	},
	'click .action--delete': function() {

		Meteor.users.remove({_id: this._id}, function(err) {
			if(err) {
				// New Messeage
				console.log(err);
				return false;
			}
			// New Message
			Router.go('admin');
		});
	}
});
