$(document).ready(function(){
	$(".di-new-message-button").click(function(){
    
		var formFunction = function(values){
			
	        var res = text(JSON.stringify(values));
	        
	        alert(res);
//			mApi().forum.areas.create(values).callback(function(err, result) {
//			});			
		}	
			
	    mApi().forum.areas.read()
	      .callback(function (err, areas) {
	      	if( err ){
	          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
	    	}else{ 		
			
			openInSN('/discussion/newmessage.dust', areas );
			
	    	}
	      });
       
	});

	$(".di-new-area-button").click(function(){

		var formFunction = function(values){
			mApi().forum.areas.create(JSON.parse(values)).callback(function(err, result) {
			});			
		}			
	
	    mApi().forum.areas.read()
	      .callback(function (err, areas) {
	      	if( err ){
	          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
	    	}else{ 		
			
			openInSN('/discussion/newarea.dust', areas, formFunction );
			
	    	}
	      });
		
	});

	
       
	});

