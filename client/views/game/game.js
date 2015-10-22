
Template.game.rendered = function() {
	$('body').addClass('game-page');

	GAME_CONTROLS.init();
}

Template.game.destroyed = function(){
	$('body').removeClass('game-page');
}

Template.game.helpers({
	'status': function() {
		return SessionAmplify.get('status');
	},
});

Template.ended.helpers({
	'finalScore': function() {
		return SessionAmplify.get('finalScore');
	}
});
