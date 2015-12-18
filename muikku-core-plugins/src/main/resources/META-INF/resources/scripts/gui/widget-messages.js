 
$(document).ready(function(){

    var WORD_COUNT = 50;
  
    function generatePreview(html){
      var text = $('<div>').html(html).text();
      var words = text.split(' ');
      if (words.length < WORD_COUNT) {
        return text;
      } else {
        text = "";
        for (var i = 0; i < WORD_COUNT; i++) {
          text += ' ' + words[i];
        }
        return text + '...';
      }
    }
  
    function _refreshMessagesWidgetMessagesList() {
      mApi({async: false}).communicator.items.read({
        'firstResult': 0,
        'maxResults': 6
      }).callback(function (err, messages) {
          
        if( err ){
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
        }else{
          for(var i = 0, j = messages.length; i < j; i++){
            messages[i].caption =  $('<div>').html(messages[i].caption).text();
//            messages[i].content = generatePreview(messages[i].content);
          }

          renderDustTemplate('frontpage/widget_messages.dust', 
          {
             messages : messages
          }, function (text) {

            $('#widgetMessages').empty();
            $('#widgetMessages').append($.parseHTML(text));
            
          });
        }
      });
    }
    
    $(document).on("Communicator:newmessagereceived", function (event, data) {
      _refreshMessagesWidgetMessagesList();
    });
      
    _refreshMessagesWidgetMessagesList();
	});
 	
