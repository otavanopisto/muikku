$(document).ready(function() {

  mApi().user.property.read('last-workspace').callback(function(err, property) {
    if (!err && property.value) {
      var lastWorkspace = $.parseJSON(property.value);
      renderDustTemplate('frontpage/widget_last_workspace.dust', {
        lastWorkspace : lastWorkspace
      }, function(text) {
        $('#last-workspace').append($.parseHTML(text));
      });
    }
  });

});
