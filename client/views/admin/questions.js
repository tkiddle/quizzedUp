Template.questions.rendered = function(){
	$('body').addClass('admin-page');
}

Template.questions.destroyed = function(){
	$('body').removeClass('admin-page');
}

Template.questions.helpers({
	'questions': function() {
		return Questions.find();
	},

	'totalQuestions': function() {
		return Questions.find().count();
	}
});

Template.questions.events({
	'click .action--delete': function() {
		Questions.remove({_id: this._id}, function(err) {
			if(err) {
				// New Messeage
				return false;
			}

			// New Message
		});
	}
});
