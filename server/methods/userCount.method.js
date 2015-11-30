Meteor.methods({

	'registeredUserCount': function() {
		return Meteor.users.find().count();
	}

});
