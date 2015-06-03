$(document).ready(function(){
  
  function confirmThreadRemoval(confirmCallback) {
    renderDustTemplate('discussion/discussion-confirm-thread-removal.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        resizable: false,
        width: 360,
        dialogClass: "discussion-confirm-dialog",
        buttons: [{
          'text': dialog.attr('data-button-confirm-text'),
          'class': 'delete-button',
          'click': function(event) {
            $(this).dialog("close");
            confirmCallback();
          }
        }, {
          'text': dialog.attr('data-button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog("close");
          }
        }]
      });
    }, this));
  }
	
    DiscImpl = $.klass({

    	init : function(){
    		// todo: parse url
            this.refreshLatest();	
            this.refreshAreas();	
    	    $(DiscImpl.msgContainer).on("click", '.di-message:not(.open)', $.proxy(this.loadThread,this));  
            $(DiscImpl.msgContainer).on("click", '.icon-goback', $.proxy(this.refreshLatest,this));
    	    $(DiscImpl.msgContainer).on("click", '.di-message-reply-link', $.proxy(this.replyThread,this));		    
          $(DiscImpl.msgContainer).on("click", '.di-remove-thread-link', $.proxy(this._onRemoveThreadClick,this));  
    	},
    	
    	
    	refreshLatest : function(){

            this.clearMessages();
;  
    	    
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
    		          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
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
    	          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.selectarea.empty', err));
    	  	}else{    	  

	  			 var select = $("#discussionAreaSelect");


	           $(select).empty();	  			 
	  		   if(areas.length != 0){
	  			 var allAreas = $("<option value='all'>" + getLocaleText('plugin.discussion.browseareas.all', err) + "</option>");
	  			 allAreas.appendTo(select);
	  			 for(var i = 0; i < areas.length; i++ ){
	  				var name = areas[i].name;
	  				var id = areas[i].id;
	  				var groupId = areas[i].groupId;
	  		
	  				if(groupId == null){
	  	  				$("<option value='" + id + "'>" + name + "</option>").appendTo(select);
	  				}
		  				
		  		} 			   
	  		    }else{
	  		    	$("<option>" + getLocaleText('plugin.discussion.selectarea.empty') + "</option>").appendTo(select);
	  			   
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

    	          
    	          mApi().user.users.read(thread.creator).callback(function(err, user){
      	            thread.creatorFullName = user.firstName + ' ' +  user.lastName;	
      	             	
      	          });    	          
    	          
       	          var d = new Date(thread.created);
          	       
    	          thread.prettyDate = d.toLocaleString();  	      	          
    	          
    	          threadCallback();
    	    	
    	    })
    	    .callback(function (err, threads) {
    	  	  
    		    if( err ){
    		        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
    		  	}else{    	  

    		  	 renderDustTemplate('/discussion/discussion_items_open.dust', threads, function(text) {
    		 		$(DiscImpl.msgContainer).append($.parseHTML(text));
    		  	});
    		  	}
    	    });		
    	    
	  		this.loadThreadReplies(aId, tId);     		
    	},    	
    	
	    filterMessagesByArea : function(sel){
            var aId = sel.value;
//	    	var element = $(event.target); 
//	        element = element.parents(".di-message");
//	        var aId = $(element).find("input[name='areaId']").attr('value') ;
	        
		    this.clearMessages();	    
    	    if (aId == 'all'){
    	    	this.refreshLatest();
    	    }else{
			    mApi().forum.areas.threads.read(aId).on('$', function(thread, threadCallback){
	
	  	          mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area){
	  	            thread.areaName = area.name;	
	  	             	
	  	          });
	
		          mApi().user.users.read(thread.creator).callback(function(err, user){
	    	            thread.creatorFullName = user.firstName + ' ' +  user.lastName;	
	    	             	
	    	      });  	          
	  	          
	   	          var d = new Date(thread.created);
	   	       
		          thread.prettyDate = d.toLocaleString();  	          
	  	          
			      threadCallback();
			    })
		    	.callback(function(err, threads){
				    if( err ){
				        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
				  	}else{    	  
	
					  	renderDustTemplate('/discussion/discussion_items.dust', threads, function(text) {
		
					  		$(DiscImpl.msgContainer).append($.parseHTML(text));
		
		
					  		
					  	});
				  	}    
				    
	
		    	});

    	    }
	    },
    
	    loadThread : function(event){

	    	var element = $(event.target); 
	        element = element.parents(".di-message");
	        var tId = $(element).attr("id");
	        var aId = $(element).find("input[name='areaId']").attr('value') ;
	        
		    this.clearMessages();	    
    	    
		    mApi().forum.areas.threads.read(aId,tId).on('$', function(thread, threadCallback){

  	          mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area){
  	            thread.areaName = area.name;	
  	             	
  	          });

	          mApi().user.users.read(thread.creator).callback(function(err, user){
    	            thread.creatorFullName = user.firstName + ' ' +  user.lastName;	
    	             	
    	      });  	          
  	          
   	          var d = new Date(thread.created);
   	       
	          thread.prettyDate = d.toLocaleString();  	          
  	          
		      threadCallback();
		    })
	    	.callback(function(err, threads){
			    if( err ){
			        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
			  	}else{    	  

				  	renderDustTemplate('/discussion/discussion_items_open.dust', threads, function(text) {
	
				  		$(DiscImpl.msgContainer).append($.parseHTML(text));
	
	
				  		
				  	});
			  	}    
			    

	    	});

		    this.loadThreadReplies(aId, tId);   		    
		    
	    },

	    loadThreadReplies : function(areaId,threadId){

            this.clearReplies();
            
		    mApi().forum.areas.threads.replies.read(areaId,threadId).on('$', function(replies, repliesCallback){

  	          mApi().forum.areas.read(replies.forumAreaId).callback(function(err, area){
  	            replies.areaName = area.name;	
  	             	
  	          });
  	          
	          mApi().user.users.read(replies.creator).callback(function(err, user){
    	            replies.creatorFullName = user.firstName + ' ' +  user.lastName;	
    	             	
    	      }); 
   	          var d = new Date(replies.created);
   	       
	          replies.prettyDate = d.toLocaleString();  	          
		      repliesCallback();
		    })
	    	.callback(function(err, replies){
			    if( err ){
			        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noreplies', err));
			  	}else{    	  

				  	renderDustTemplate('/discussion/discussion_subitems.dust', replies, function(text) {
	
				  		$(DiscImpl.msgContainer).append($.parseHTML(text));
	
				  	});
			  	}    		
	    	});
	    },
	    
	    _onRemoveThreadClick: function (event) {
	      confirmThreadRemoval($.proxy(function () {
          var areaId = $('input[name="areaId"]').val();
	        var threadId = $('input[name="threadId"]').val();

	        mApi().forum.areas.threads.del(areaId, threadId).callback($.proxy(function(err, result) {
	          if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
	          } else {
	            window.location.reload(true);
	          }
	        }, this));     
	      }, this));
	    },
	    
	    replyThread : function(event){

	    	var element = $(event.target); 
	        element = element.parents(".di-message");
	        var tId = $(element).attr("id");
	        var aId = $(element).find("input[name='areaId']").attr('value');	    	
	    	
    			var sendReply = function(values){
    				mApi().forum.areas.threads.replies.create(aId, tId, values).callback(function(err, result) {
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
				        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
				  	}else{    	  
						  openInSN('/discussion/discussion_create_reply.dust', thread, sendReply);		
					  	}
				  	});  		
	    },

	    clearMessages : function(){
	    	$(DiscImpl.msgContainer).empty();
	    },	    
	    
	    clearReplies : function(){
	    	$(DiscImpl.subContainer).empty();
		 },	  	    
		 
	    _klass : {
	    	// Variables for the class
		  msgContainer : ".di-messages-container",
	      subContainer : ".di-sumbessages-container",
	    	  
	    	  
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
			
			mApi().forum.areas.threads.create(forumAreaId, values)
				.callback(function(err, result) {
					
				});	
			
			 window.discussion.refreshLatest();

		}	
			
	    mApi().forum.areas.read()
	      .callback(function (err, areas) {
	      	if( err ){
	          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noareas', err));
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
	          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noareas', err));
	    	}else{ 		
			  openInSN('/discussion/discussion_create_area.dust', areas, createArea );
	    	}
	      });
		
   		

  
	
       
	});
});
