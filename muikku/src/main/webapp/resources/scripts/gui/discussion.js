$(document).ready(function(){
	
	var msgContainer = $('.di-messages-container');
	
	var areaList = function(select,areas){
		 var select = $(select);
		 
		 for(var i = 0; i < areas.length; i++ ){
			var name = areas[i].name;
			var id = areas[i].id;
			var groupId = areas[i].groupId;
			
			if(groupId == null){
  				$("<option value='" + id + "'>" + name + "</option>").appendTo(select);
			}
			
		 }
		 
	 }
	
	
    mApi().forum.areas.read()
    .callback(function (err, areas) {
  	  
	    if( err ){
	          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
	  	}else{    	  
	  		 areaList("#discussionAreaSelect",areas);
	  	}
    });
	 
	var refreshLatest = function(){
		
        $(msgContainer).empty();
	    
	    
	    mApi().forum.latest.read()
	    .callback(function (err, threads) {
	  	  
		    if( err ){
		          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
		  	}else{    	  

		  	 renderDustTemplate('/discussion/messages.dust', threads, function(text) {
		 		$(msgContainer).append($.parseHTML(text));
		  	});
		  	}
	    });		
		
	}
	
	

    refreshLatest();	
	 

        
    
	
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
			
			  refreshLatest();

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

