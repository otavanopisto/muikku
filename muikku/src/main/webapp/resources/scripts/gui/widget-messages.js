 
$(document).ready(function(){

	
    mApi().communicator.items.read()
      .callback(function (err, messages) {
    	  
      	if( err ){
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
    	}else{    	  
        renderDustTemplate('widgets/widget_messages.dust', 

        		{
        	
        	   	 messages : messages
        	
        		}, function (text) {
                  	
          $('#widgetMessages').append($.parseHTML(text));
          
        });
    	}
      });
      
	});
 	