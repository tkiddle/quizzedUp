Meteor.methods({

	'upsertQuestion': function(docQuery, upsertFields) {
		check(docQuery, Object);
		check(upsertFields, Object);

		Questions.update(docQuery, upsertFields, { upsert: true }, function(err, doc) {

			if(err) {
				console.log(err);
				return false;
			}
			return true;
		});
	}

});
