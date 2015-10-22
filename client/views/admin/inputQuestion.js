Template.inputQuestion.destroyed = function(){
	$('body').removeClass('admin-page');
}

Template.inputQuestion.rendered = function() {

	var $incorrectAnswers = $('#incorrect-answers'),
			$incorrectAnswer = $('.incorrect-answer'),
			$addMoreMultiChoice = $('#add-more'),
			DIFFICULTY_MAX = 10,
			difficulty = Template.currentData().difficulty || 1;

	$('body').addClass('admin-page');

	// Global variables
	MULTI_CHOICE_MAX = 3;
	multiChoiceCount = $incorrectAnswer.length;

	$incorrectAnswers.toggleClass('h-hidden', ($('.multichoice-type[name="type"]:checked').val() !== 'multichoice'));

	if($incorrectAnswer.length == 0) {
		Blaze.render(Template.incorrectAnswer, $('.incorrect-answers-wrap')[0]);

		$incorrectAnswer = $('.incorrect-answer');
		multiChoiceCount = $incorrectAnswer.length;
	}

	if(multiChoiceCount == MULTI_CHOICE_MAX) {
		$addMoreMultiChoice.addClass('h-hidden');
	}

	for(var i = 1; i < DIFFICULTY_MAX + 1; i++) {
		Blaze.renderWithData(Template.difficultyOptions, {
			value: i,
			selected: (difficulty == i)
		}, $('#difficulty')[0]);
	}

};

Template.inputQuestion.events({
	'submit #question-add-form': function(e) {
		e.preventDefault();

		var question = $('#question').val().trim(),
				answer = $('#answer').val().trim(),
				clue = $('#clue').val().trim(),
				difficulty = $('#difficulty').val(),
				time = $('#time').val(),
				type = $('input[name="type"]:checked').val(),
				docQuery, upsertFields, currentDocId, currentDoc,
				multichoiceAnswersArray = [],
				incorrectAnswersArray = [],
				$incorrectAnswers;

		if(type === 'multichoice') {

			$incorrectAnswers = $('.incorrect-answer');

			for(var i = 0, len = $incorrectAnswers.length; i < len; i++) {

				if($($incorrectAnswers[i]).val()) {
					incorrectAnswersArray.push($($incorrectAnswers[i]).val().trim());
					multichoiceAnswersArray.push($($incorrectAnswers[i]).val().trim());
				}
			}

			if(incorrectAnswersArray.length < 1) {

				console.log('You must have at least one additional multichoice answer!');
				return false;
			}

			multichoiceAnswersArray.push(answer);

			/**
			 * Randomize array element order in-place.
			 * Using Durstenfeld shuffle algorithm.
			 */
			function shuffleArray(array) {
				for (var i = array.length - 1; i > 0; i--) {
					var j = Math.floor(Math.random() * (i + 1));
					var temp = array[i];
					array[i] = array[j];
					array[j] = temp;
				}
				return array;
			}

			multichoiceAnswersArray = shuffleArray(multichoiceAnswersArray);


		} else {
			multichoiceAnswersArray = [];
		}

		// WIP: Tidy up these variables
		var currentDocId = Router.current(),
				currentDoc = {};

		if(currentDocId.params['_id']) {
			currentDoc = Questions.findOne({_id: currentDocId.params['_id']});
		}

		exists = Questions.findOne({
			_id: { '$ne': currentDoc._id },
			question: question,
			type: type
		});

		if(exists) {
			// new Message('warning', 'A keyword set with this name already exists.');
			console.log('This question already exists');
			return false;
		}

		docQuery = { _id: currentDoc._id || null },

		upsertFields = {
		'$setOnInsert': { createdOn: new Date() },
		'$set': {
				question: question,
				answer: answer,
				multichoice: multichoiceAnswersArray,
				incorrect: incorrectAnswersArray,
				clue: clue,
				type: type,
				time: time,
				difficulty: difficulty,
				updated: new Date()
			}
		};

		Meteor.call('upsertQuestion', docQuery, upsertFields, function() {
			Router.go('/admin/questions');
			// ADD MESSAGE!
			//new Message('success', 'You have successfully created/updated ' + name + '.');
		});

	},

	'change input[name="type"]': function(e) {
		$('#incorrect-answers').toggleClass('h-hidden', (e.target.value !== 'multichoice'));
	},

	'click #add-more': function(e) {
		e.preventDefault();

		++multiChoiceCount;

		if(multiChoiceCount > (MULTI_CHOICE_MAX - 1)) {
			$('#add-more').addClass('h-hidden');
		}

		if(multiChoiceCount > MULTI_CHOICE_MAX) {
			return false;
		}

		Blaze.render(Template.incorrectAnswer, $('.incorrect-answers-wrap')[0])
	},
	'click .action--delete': function() {
		Questions.remove({_id: this._id}, function(err) {
			if(err) {
				// New Messeage
				return false;
			}
			Router.go('/admin/questions');

			// New Message
		});
	}
});
