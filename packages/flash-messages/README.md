Messages
========

This package adds simple flash messages to your app. There are options for the following
types of message:

* warning - A red warning message
* success - A green success message
* information - A yellow information message
* confirmation - A warning message with Ok and Cancel action buttons

Usage
-----

Display a simple flash message to the user
@param  {String} - type of message (see above)
@param  {String} - Message to display to the user

```javascript
new Message('warning', 'Please provide and email address.');
```

```javascript
new Message('success', 'Successfully added a new user.');
```

```javascript
new Message('information', 'Your account is about to expire; Please consider paying.');
```

Meteor example:

```javascript
'click .action--submit': function(e) {
	e.preventDefault();

	var that = this;

	new Message('success', 'Successfully clicked a button.');
}
```



Display a confirmation flash message to the user
@param  {String} - type of message (see above)
@param  {String} - Message to display to the user
@param  {Object} - A callback function to be called when the ok button is clicked

```javascript
new Message('confirmation', 'Are you sure you delete this document?', function() {
	Collection.remove(this._id);
	new Message('success', 'You have successfully removed a document from the collection');
});
```


Meteor example:

```javascript
'click .action--delete': function(e) {
	e.preventDefault();

	var that = this;

	new Message('confirmation', 'Are you sure you delete this document?', function() {
		Collection.remove(that._id);
		new Message('success', 'You have successfully removed a document from the collection');
	});
}
```
