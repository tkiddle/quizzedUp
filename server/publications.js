/**
 * In this file we make our collections public to the client. Meteor
 * Requires that you do this for each collection that needs exposing.
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
