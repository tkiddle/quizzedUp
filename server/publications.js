/**
 * Make our collections public to the client.
 */

Meteor.publish('questions', function() {
	return Questions.find({});
});

Meteor.publish('game', function() {
	return Game.find({});
});

Meteor.publish("playersRanks", function () {
  return Meteor.users.find({ 'profile.role': 'player' });
});

Meteor.publish("players", function () {
  return Meteor.users.find({ 'profile.role': 'player'});
});

Meteor.publish("allUsers", function () {
  return Meteor.users.find({});
});
