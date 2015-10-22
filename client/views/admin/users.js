Template.users.rendered = function(){
	$('body').addClass('admin-page');
}

Template.users.destroyed = function(){
	$('body').removeClass('admin-page');
}

Template.users.helpers({
	'users': function() {
		return Meteor.users.find();
	},
	'totalUsers': function() {
		return Meteor.users.find().count();
	}
});

Template.users.events({
	'click #delete-players': function(e) {
		e.preventDefault();

		Meteor.call('deleteAllPlayers', function(err) {
			if(err) {
				new Message('warning', 'Something has gone wrong');
				return;
			}
			new Message('success', 'All players have been deleted');
		})
	}
});
