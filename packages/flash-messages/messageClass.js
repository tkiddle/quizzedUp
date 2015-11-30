/**
 *	Adding a flash message couldn't be easier, check out the examples below.
 *
 *	new Message('confirmation', 'Are you sure you want to permanently delete ' +
 *	countryName + '?', function() {
 *		Countries.remove(that._id);
 *		new Message('success', countryName + ' successfully deleted.');
 *	});
 *
 *	new Message('warning', 'Please add at least one language to this country.');
 */


messages = messages || {};
Router = Package['iron:router'].Router;

Message = function(type, message, cb) {
	this.type = type;
	this.message = message;
	this.tpl = '';
	this.heading = '';
	this.callback = cb;

	this.config = {
		showHeading: false
	}

	switch(type) {
		case 'success':
			// Success message
			this.heading = 'Success!'
			this.classes = 'flash-message flash-message--success';
			break;
		case 'warning':
			// Warning message
			this.heading = 'Warning!'
			this.classes = 'flash-message flash-message--warning';
			break;
		case 'confirmation':
			// Warning with confirmation controls
			this.heading = 'Warning!'
			this.classes = 'flash-message flash-message--warning';
			break;
		default:
			// Information message
			this.heading = 'Information!'
			this.classes = 'flash-message flash-message--information';
			break;
	}

	this.draw();
};

Message.prototype.draw = function() {

	var placement = document.getElementById('js-flashMessage');

	this.template = Blaze.renderWithData(Template.flashMessageItem, {
		classes: this.classes,
		heading: this.config.showHeading ? this.heading : false,
		showButtons: this.type === 'confirmation',
		showClose: this.type !== 'confirmation',
		message: this.message
	}, placement);

	if(messages.activeMessage) {
		this.destroy();
	}

	messages.activeMessage = this;

	if(this.type === 'success') {
		Session.set('message', { type: this.type, message: this.message });
	}
};

Message.prototype.destroy = function() {
	Blaze.remove(messages.activeMessage.template);
	messages.activeMessage = null;
};
