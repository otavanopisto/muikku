$(document).ready(function() {
  
  function _refreshMessagesWidgetMessagesList() {
    mApi().communicator.items.read({
      'firstResult': 0,
      'maxResults': 6
    }).callback(function(err, messages) {
      if (!err) {
        for (var i = 0, j = messages.length; i < j; i++) {
          messages[i].caption =  $('<div>').html(messages[i].caption).text();
        }
        renderDustTemplate('frontpage/widget_messages.dust', {
          messages : messages
        },
        function(text) {
          $('#messages').empty();
          $('#messages').append($.parseHTML(text));
        });
      }
    });
  }
    
  $(document).on("Communicator:newmessagereceived", function (event, data) {
    _refreshMessagesWidgetMessagesList();
  });
  
  _refreshMessagesWidgetMessagesList();

});