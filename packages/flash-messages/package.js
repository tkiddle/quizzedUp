Package.describe({
  name: 'tkiddle:messages',
  version: '0.0.1',
  summary: 'Handle messages displayed to the user when performing and action on a collection',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom('1.1.0.2');
  api.use(['templating'], 'client');

  api.addFiles('views/message.html', 'client');
  api.addFiles('views/message.js', 'client');
  api.addFiles('messageClass.js', ['client']);

  api.export('Message');
});
