Template.multichoice.rendered = function() {
	GAME_CONTROLS.stageType = 'multichoice';
};

Template.multichoice.events({
	'click .multichoice-list:not(".answered"):not(".unanswered") .multichoice-list__item': function(e, tpl) {
		e.preventDefault();

		GAME_CONTROLS.stageAnsweredTS = new Date().getTime();

		$('.multichoice-list').addClass('answered');

		GAME_CONTROLS.stageType = 'multichoice';
		GAME_CONTROLS.endStage(tpl.data.answer, e);
	}
})
