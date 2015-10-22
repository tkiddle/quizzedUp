Template.wordfill.rendered = function() {
	GAME_CONTROLS.stageType = 'wordfill';
};

Template.wordfill.events({
	'submit #wordfill-stage': function(e, tpl) {
		e.preventDefault();

		GAME_CONTROLS.stageAnsweredTS = new Date().getTime();

		if(!$(e.target).hasClass('answered') && !$(e.target).hasClass('unanswered')) {

			$('#wordfill-stage').addClass('answered');

			GAME_CONTROLS.stageType = 'wordfill';
			GAME_CONTROLS.endStage(tpl.data.answer, $('#wordfill-answer'));
		}
	}
})
