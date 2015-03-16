$(document).ready(function(){
	
    DiscImpl = $.klass({

    	init : function(){
    		// todo: parse url
            this.refreshLatest();	
            this.refreshAreas();	
    
    	},
    	
    	
    	refreshLatest : function(){
 		
            this.clearMessages();
            
    	    $(DiscImpl.msgContainer).on("click", '.di-message:not(.open)', $.proxy(this.loadThread,this));  
    	    
    	    mApi().forum.latest.read().on('$', function(msgs, msgsCallback){
    	          mApi().forum.areas.read(msgs.forumAreaId).callback(function(err, area){
    	            msgs.areaName = area.name;	
    	             	
    	          });
    	          
    	          var d = new Date(msgs.created);
 
    	          msgs.prettyDate = d.toLocaleString();
    	          
    	          msgsCallback();
    	    	
    	    })
    	    .callback(function (err, threads) {
    	  	  
    		    if( err ){
    		          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
    		  	}else{    	  

    		  	 renderDustTemplate('/discussion/discussion_items.dust', threads, function(text) {
    		 		$(DiscImpl.msgContainer).append($.parseHTML(text));
    		 		
    		  	});
    		  	}
    	    });		
    		
    	},
    	
    	refreshAreas : function(){   
    		
    	 mApi().forum.areas.read()
        .callback(function (err, areas) {
        	  
    	    if( err ){
    	          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
    	  	}else{    	  

	  			 var select = $("#discussionAreaSelect");


	            $(select).empty();	  			 
	  			 
	  			 for(var i = 0; i < areas.length; i++ ){
	  				var name = areas[i].name;
	  				var id = areas[i].id;
	  				var groupId = areas[i].groupId;
	  				
	  				if(groupId == null){
	  	  				$("<option value='" + id + "'>" + name + "</option>").appendTo(select);
	  				}
	  				
	  			 }
		  			 
    	  		

    	  	}
        });
    
    
    	},
    	
    	refreshThread : function(aId,tId){
     		
            this.clearMessages();
            

    	    
    	    mApi().forum.areas.threads.read(aId,tId).on('$', function(thread, threadCallback){
    	          mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area){
    	            thread.areaName = area.name;	
    	             	
    	          });
    	          
    	          threadCallback();
    	    	
    	    })
    	    .callback(function (err, threads) {
    	  	  
    		    if( err ){
    		          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
    		  	}else{    	  

    		  	 renderDustTemplate('/discussion/discussion_items_open.dust', threads, function(text) {
    		 		$(DiscImpl.msgContainer).append($.parseHTML(text));
    		 		
    		  	});
    		  	}
    	    });		
    		
    	},    	
    
	    loadThread : function(event){

	    	var element = $(event.target); 
	        element = element.parents(".di-message");
	        var tId = $(element).attr("id");
	        var aId = $(element).find("input[name='areaId']").attr('value') ;
	        
		    this.clearMessages();	
		    
    	    $(DiscImpl.msgContainer).on("click", '.icon-goback', $.proxy(this.refreshLatest,this));
    	    $(DiscImpl.msgContainer).on("click", '.di-message-reply-link', $.proxy(this.loadReply,this));		    
    	    
    
		    mApi().forum.areas.threads.read(aId,tId).on('$', function(thread, threadCallback){

  	          mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area){
  	            thread.areaName = area.name;	
  	             	
  	          });
		      threadCallback();
		    })
	    	.callback(function(err, threads){
			    if( err ){
			        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
			  	}else{    	  

				  	renderDustTemplate('/discussion/discussion_items_open.dust', threads, function(text) {
	
				  		$(DiscImpl.msgContainer).append($.parseHTML(text));
	
				  	});
			  	}    		
	    	});
	    },
	    
	    loadReply : function(event){

	    	var element = $(event.target); 
	        element = element.parents(".di-message");
	        var tId = $(element).attr("id");
	        var aId = $(element).find("input[name='areaId']").attr('value');	    	
	    	
			var sendReply = function(values){
				mApi().forum.areas.threads.create(values).callback(function(err, result) {
				});			
				
				window.discussion.refreshThread(aId,tId);
	
				
			}			

		    mApi().forum.areas.threads.read(aId,tId).on('$', function(thread, threadCallback){

	  	          mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area){
	  	            thread.areaName = area.name;	
	  	             	
	  	          });
			      threadCallback();
			    })
		    	.callback(function(err, thread){
				    if( err ){
				        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
				  	}else{    	  
						  openInSN('/discussion/discussion_create_reply.dust', thread, sendReply);		
					  	}
				  	});  		
			
	    		   	
	    	
	    },

	    clearMessages : function(){
		  $(DiscImpl.msgContainer).empty();
	    },	    
	    
	    
	    _klass : {
	    	// Variables for the class
		  msgContainer : ".di-messages-container" 
	    }
    
    
    }); 
	

   window.discussion = new DiscImpl();
  
        
	$(".di-new-message-button").click(function(){
	    
		var createMessage = function(values){
			var forumAreaId = null;
	    
        
	         for(value in values){
			  if(value == "forumAreaId"){
				  var forumAreaId = values[value];
				  delete values[value];
			  }    	
	         }
			
			mApi().forum.areas.threads.replies.create(forumAreaId, values)
				.callback(function(err, result) {
					
				});	
			
			 window.discussion.refreshLatest();

		}	
			
	    mApi().forum.areas.read()
	      .callback(function (err, areas) {
	      	if( err ){
	          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
	    	}else{ 		
			  openInSN('/discussion/discussion_create_message.dust', areas, createMessage );
	
	    	}
	      });
       
	});
	
	

	$(".di-new-area-button").click(function(){

		var createArea = function(values){
			mApi().forum.areas.create(values).callback(function(err, result) {
			});			
			
			window.discussion.refreshLatest();
			window.discussion.refreshAreas();
		}			
	
	    mApi().forum.areas.read()
	      .callback(function (err, areas) {
	      	if( err ){
	          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
	    	}else{ 		
			  openInSN('/discussion/discussion_create_area.dust', areas, createArea );
	    	}
	      });
		
   		

  
	
       
	});
});
