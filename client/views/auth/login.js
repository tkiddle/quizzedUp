Template.login.rendered = function(){
	$('body').addClass('auth-page');
}

Template.login.destroyed = function(){
	$('body').removeClass('auth-page');
}

Template.login.events({

	'submit #login-form': function(e) {
		e.preventDefault();

		var username = $('#nickname').val().toLowerCase().trim(),
				password = username;

		if(username && password) {

			Meteor.loginWithPassword(username, password, function(err) {
				if(err) {
					console.log(err);
					new Message('warning', err.reason);
					return false;
				}
				Router.go('/game');
			});

		}

	},
});
