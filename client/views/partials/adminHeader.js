Template.adminHeader.events({
	'click #admin-nav-trigger': function() {
		var $navList = $('#admin-nav-list');

		$('#admin-nav-trigger').toggleClass('admin-nav__trigger--active');
		$navList.toggleClass('h-hidden');
	},

	'click .admin-nav__item': function() {
		var $navList = $('#admin-nav-list');

		$navList.addClass('h-hidden');
		$('#admin-nav-trigger').removeClass('admin-nav__trigger--active');
	}
});

