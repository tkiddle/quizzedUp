Meteor.methods({

	'deleteAllPlayers': function() {
		Meteor.users.remove({'profile.role': 'player'}, function(err, num) {
			if(err) {
				console.log(err);
				return err;
			}
		});
	}

});
