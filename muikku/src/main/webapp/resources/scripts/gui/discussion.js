$(document).ready(function(){
	$(".di-new-message-button").click(function(){
    
		var createMessage = function(values){
        var forumAreaId = null;
			
         for(value in values){
		  if(value == "forumAreaId"){
			  var forumAreaId = values[value];
			  delete values[value];
		  }    	
        }
			
			mApi().forum.areas.threads.create(forumAreaId, values)
			.callback(function(err, result) {
			});	
		}	
			
	    mApi().forum.areas.read()
	      .callback(function (err, areas) {
	      	if( err ){
	          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
	    	}else{ 		
			
			  openInSN('/discussion/newmessage.dust', areas, createMessage );
			
	    	}
	      });
       
	});

	$(".di-new-area-button").click(function(){

		var createArea = function(values){
			
			
			mApi().forum.areas.create(values).callback(function(err, result) {
			});			
		}			
	
	    mApi().forum.areas.read()
	      .callback(function (err, areas) {
	      	if( err ){
	          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
	    	}else{ 		
			

			  openInSN('/discussion/newarea.dust', areas, createArea );

			
	    	}
	      });
		
	});

	
       
	});

