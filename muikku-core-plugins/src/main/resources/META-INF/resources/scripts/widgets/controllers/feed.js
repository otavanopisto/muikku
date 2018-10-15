module([], function(){
  $.widget("custom.feedControllerWidget", {
    options: {
      queryOptions: {},
      feedItemTemplate: '',
      feedReadTarget: ''
    },
    _create(){
      var self = this;
      mApi().feed.feeds.read(
        self.options.feedReadTarget,
        self.options.queryOptions)
      .callback(function (err, entries) {
        renderDustTemplate(self.options.feedItemTemplate, {entries: entries}, function(text) {
          self.element.html(text);
        });
      });
    }
  });
});