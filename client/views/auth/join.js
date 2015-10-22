Template.join.rendered = function(){
	$('body').addClass('auth-page');
}

Template.join.destroyed = function(){
	$('body').removeClass('auth-page');
}

Template.join.events({
	'submit #join-form': function(e) {
		e.preventDefault();

		var fullname = $('#fullname').val().trim(),
				nickname = $('#nickname').val().toLowerCase().trim(),
				insertFields;

		Meteor.call('registeredUserCount', function(err, count) {

			insertFields = {
				username: nickname,
				password: nickname,
				profile: {
					name: fullname,
					nickname: nickname,
					uuid: count,
					role: (count == 0 ? 'admin' : 'player'),
					game: {
						score: 0
					}
				}
			}

			if(fullname && nickname) {
				Accounts.createUser(insertFields, function(err) {
					if(err) {
						console.log(err);
						new Message('warning', err.reason);
						return false;
					}
					Router.go('game');
				});
			}

		});

	},
});
