$(document).ready(function(){
	
    GuideImpl = $.klass({

    	init : function(){
    		// todo: parse url
            this.refreshUsers();	
    	    $(GuideImpl.guideContainer).on("click", '.gt-user:not(.open)', $.proxy(this.showUser,this));  
    	    $(GuideImpl.guideContainer).on("click", '.gt-tool-view-profile', $.proxy(this.viewUserProfile,this));
    	    $(GuideImpl.guideContainer).on("click", '.gt-tool-send-mail', $.proxy(this.messageToUser,this));    	    
    	    
    	},
    	
    	
    	refreshUsers : function(){

            this.clearUsers();
;  
    	    
    	    mApi().user.users.read()
    	    .callback(function (err, users) {
    	  	  
    		    if( err ){
    		          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nousers', err));
    		  	}else{    	  

    		  	 renderDustTemplate('/guider/guider_items.dust', users, function(text) {
    		 		$(GuideImpl.guideContainer).append($.parseHTML(text));
    		 		
    		  	});
    		  	}
    	    });		
    		
    	},
    	
//    	refreshAreas : function(){   
//
//    	 mApi().forum.areas.read()
//        .callback(function (err, areas) {
//        	  
//    	    if( err ){
//    	          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.selectarea.empty', err));
//    	  	}else{    	  
//
//	  			 var select = $("#discussionAreaSelect");
//
//
//	           $(select).empty();	  			 
//	  		   if(areas.length != 0){
//	  			 var allAreas = $("<option value='all'>" + getLocaleText('plugin.discussion.browseareas.all', err) + "</option>");
//	  			 allAreas.appendTo(select);
//	  			 for(var i = 0; i < areas.length; i++ ){
//	  				var name = areas[i].name;
//	  				var id = areas[i].id;
//	  				var groupId = areas[i].groupId;
//	  		
//	  				if(groupId == null){
//	  	  				$("<option value='" + id + "'>" + name + "</option>").appendTo(select);
//	  				}
//		  				
//		  		} 			   
//	  		    }else{
//	  		    	$("<option>" + getLocaleText('plugin.discussion.selectarea.empty') + "</option>").appendTo(select);
//	  			   
//	  		    }
//	            
//
//		  			 
//    	  		
//
//    	  	}
//        });
//    
//    
//    	},
    	
//    	refreshThread : function(aId,tId){
//
//            this.clearMessages();
//            
//
//    	    
//    	    mApi().forum.areas.threads.read(aId,tId).on('$', function(thread, threadCallback){
//    	          mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area){
//    	            thread.areaName = area.name;	
//    	             	
//    	          });
//
//    	          
//    	          mApi().user.users.read(thread.creator).callback(function(err, user){
//      	            thread.creatorFullName = user.firstName + ' ' +  user.lastName;	
//      	             	
//      	          });    	          
//    	          
//       	          var d = new Date(thread.created);
//          	       
//    	          thread.prettyDate = d.toLocaleString();  	      	          
//    	          
//    	          threadCallback();
//    	    	
//    	    })
//    	    .callback(function (err, threads) {
//    	  	  
//    		    if( err ){
//    		        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
//    		  	}else{    	  
//
//    		  	 renderDustTemplate('/discussion/discussion_items_open.dust', threads, function(text) {
//    		 		$(DiscImpl.msgContainer).append($.parseHTML(text));
//    		 		
//    		  	});
//    		  	}
//    	    });		
//    	    
//	  		this.loadThreadReplies(aId, tId);     		
//    	},    	
    	
//	    filterMessagesByArea : function(sel){
//            var aId = sel.value;
//
//	        
//		    this.clearMessages();	    
//    	    if (aId == 'all'){
//    	    	this.refreshLatest();
//    	    }else{
//			    mApi().forum.areas.threads.read(aId).on('$', function(thread, threadCallback){
//	
//	  	          mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area){
//	  	            thread.areaName = area.name;	
//	  	             	
//	  	          });
//	
//		          mApi().user.users.read(thread.creator).callback(function(err, user){
//	    	            thread.creatorFullName = user.firstName + ' ' +  user.lastName;	
//	    	             	
//	    	      });  	          
//	  	          
//	   	          var d = new Date(thread.created);
//	   	       
//		          thread.prettyDate = d.toLocaleString();  	          
//	  	          
//			      threadCallback();
//			    })
//		    	.callback(function(err, threads){
//				    if( err ){
//				        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
//				  	}else{    	  
//	
//					  	renderDustTemplate('/discussion/discussion_items.dust', threads, function(text) {
//		
//					  		$(DiscImpl.msgContainer).append($.parseHTML(text));
//		
//		
//					  		
//					  	});
//				  	}    
//				    
//	
//		    	});
//
//    	    }
//	    },
    
//	    loadThread : function(event){
//
//	    	var element = $(event.target); 
//	        element = element.parents(".di-message");
//	        var tId = $(element).attr("id");
//	        var aId = $(element).find("input[name='areaId']").attr('value') ;
//	        
//		    this.clearMessages();	    
//    	    
//		    mApi().forum.areas.threads.read(aId,tId).on('$', function(thread, threadCallback){
//
//  	          mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area){
//  	            thread.areaName = area.name;	
//  	             	
//  	          });
//
//	          mApi().user.users.read(thread.creator).callback(function(err, user){
//    	            thread.creatorFullName = user.firstName + ' ' +  user.lastName;	
//    	             	
//    	      });  	          
//  	          
//   	          var d = new Date(thread.created);
//   	       
//	          thread.prettyDate = d.toLocaleString();  	          
//  	          
//		      threadCallback();
//		    })
//	    	.callback(function(err, threads){
//			    if( err ){
//			        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
//			  	}else{    	  
//
//				  	renderDustTemplate('/discussion/discussion_items_open.dust', threads, function(text) {
//	
//				  		$(DiscImpl.msgContainer).append($.parseHTML(text));
//	
//	
//				  		
//				  	});
//			  	}    
//			    
//
//	    	});
//
//		    this.loadThreadReplies(aId, tId);   		    
//		    
//	    },

//	    loadThreadReplies : function(areaId,threadId){
//
//            this.clearReplies();
//            
//		    mApi().forum.areas.threads.replies.read(areaId,threadId).on('$', function(replies, repliesCallback){
//
//  	          mApi().forum.areas.read(replies.forumAreaId).callback(function(err, area){
//  	            replies.areaName = area.name;	
//  	             	
//  	          });
//  	          
//	          mApi().user.users.read(replies.creator).callback(function(err, user){
//    	            replies.creatorFullName = user.firstName + ' ' +  user.lastName;	
//    	             	
//    	      }); 
//   	          var d = new Date(replies.created);
//   	       
//	          replies.prettyDate = d.toLocaleString();  	          
//		      repliesCallback();
//		    })
//	    	.callback(function(err, replies){
//			    if( err ){
//			        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noreplies', err));
//			  	}else{    	  
//
//				  	renderDustTemplate('/discussion/discussion_subitems.dust', replies, function(text) {
//	
//				  		$(DiscImpl.msgContainer).append($.parseHTML(text));
//	
//				  	});
//			  	}    		
//	    	});
//	    },
//	    
//	    
	    viewUserProfile : function(event){

	    	var element = $(event.target); 
	        element = element.parents(".gt-user");
	        var uId = $(element).attr("id");

	        this.clearUsers();
	        
	        
		    mApi().user.users.read(uId).callback(function(err, user){
				    if( err ){
				        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nouser', err));
				  	}else{    	  
					  	renderDustTemplate('/guider/guider_view_profile.dust', user, function(text) {				  		
					        $(GuideImpl.guideContainer).append($.parseHTML(text));
					        
						  	var cont1 = $(".gt-data-container-1 div.gt-data");
						  	var cont2 = $(".gt-data-container-2 div.gt-data");
						  	var cont3 = $(".gt-data-container-3 div.gt-data");
						  	
						  	renderDustTemplate('/dummy/dummy_list_long.dust',null,function(text){
						  		$(cont1).append($.parseHTML(text));

							  	renderDustTemplate('/dummy/dummy_lorem_short.dust',null, function(text){
							  		$(cont2).append($.parseHTML(text));
							  		
								  	renderDustTemplate('/dummy/dummy_lorem_short.dust',null, function(text){
								  		$(cont3).append($.parseHTML(text));
								  		
								  	});		
							  	});
						  		
						  	});
					        
					  	});
					  	
			  	
				  	}	
		    });  		
				
	    },    	
	    showUser : function(event){

	    	var element = $(event.target); 
	        element = element.parents(".gt-user");
	        var uId = $(element).attr("id");
		    var det = element.find(".gt-user-details"); 
	        var detcont = element.find(".gt-user-details-content"); 

	    	$(element).removeClass("closed");
	    	$(element).addClass("open");
	    	$(det).css("display","block");	    				

		    mApi().user.users.read(uId).callback(function(err, user){
				    if( err ){
				        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nouser', err));
				  	}else{    	  
					  	renderDustTemplate('/guider/guider_item_details.dust', user, function(text) {				  		
					  		$(detcont).append($.parseHTML(text));
					  	});
				  	}	
		    });  		
				
	    },
	    
	   messageToUser : function(event){
	    	var element = $(event.target); 
	        element = element.parents(".gt-user");
	        var uId = $(element).attr("id");

		   
			var createMessage = function(values){

		         for(value in values){
					  if(value == "recipienIds"){
						  var recipientIds = values[value];
						  delete values[value];
					  }    	
			         }				
//	               	categoryName: "message",
//	                caption : subject,
//	                content : content,
//	                tags : tags,
//	                recipientId : recipientId,
//	                recipientGroupIds : groupIds				
				
	            mApi().communicator.messages.create(recipientIds,values)
	              .callback(function (err, result) {
	              });

			}	
				
		    mApi().user.users.read(uId)
		      .callback(function (err, user) {
		      	if( err ){
		          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noareas', err));
		    	}else{ 		
				  openInSN('/guider/guider_create_message.dust', user, createMessage );
		
		    	}
		      });		   
	   }, 

	    clearUsers : function(){
	    	$(GuideImpl.guideContainer).empty();
	    },	    
	    
//	    clearReplies : function(){
//	    	$(DiscImpl.subContainer).empty();
//		 },	  	    
//		 
	    _klass : {
	    	// Variables for the class
		  guideContainer : ".gt-students-view-container",

	    	  
	    	  
	    }
    
    
    }); 
	

   window.guider = new GuideImpl();
  
        
	$(".gt-main-dropdown-label").click(function(){
		 window.guider.refreshUsers();   
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
