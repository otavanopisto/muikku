 
$(document).ready(function(){

	
    mApi().communicator.items.read()
      .callback(function (err, result) {
        renderDustTemplate('widgets/widget_messages.dust', result, function (text) {
          $('#widgetMessages').append($.parseHTML(text));
        });
      });
    
	});

