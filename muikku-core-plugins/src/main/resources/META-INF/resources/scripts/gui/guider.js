$(document).ready(function(){
	
    GuideImpl = $.klass({

    	init : function(){
    		// todo: parse url
            this.refreshUsers();	
    	    $(GuideImpl.guideContainer).on("click", '.gt-user:not(.open)', $.proxy(this.showUser,this));  
    	    $(GuideImpl.guideContainer).on("click", '.gt-tool-view-profile', $.proxy(this.viewUserProfile,this));
    	    $(GuideImpl.guideContainer).on("click", '.gt-tool-send-mail', $.proxy(this.messageToUser,this));    	    
    	    
          dust.preload("guider/guider_item.dust");
    	},
    	
    	
    	refreshUsers : function(){

            this.clearUsers();
            var search = $(".gt-search");
            var searchVisible = search.is(":visible");
            
            if(searchVisible == false ){
            	search.show("slide");
            	
            }
            
 
    	    
    	    mApi().user.users.read({ archetype : 'STUDENT', maxResults: 100000 })
    	    .callback(function (err, users) {
    	  	  
    		    if( err ){
    		          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nousers', err));
    		  	}else{    	  

    		  	 renderDustTemplate('guider/guider_items.dust', users, function(text) {
    		 		$(GuideImpl.guideContainer).append($.parseHTML(text));
    		 		
    		  	});
    		  	}
    	    });		
    		
    	},
    	
	    viewUserProfile : function(event){

			var element = $(event.target); 
			element = element.parents(".gt-user");
			var uId = $(element).attr("id");
			var searchEl = $(".gt-search");
            
	        this.clearUsers();
	        
	        
		    mApi().user.users.read(uId).callback(function(err, user){
				    if( err ){
				        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nouser', err));
				  	}else{    	  
					  	renderDustTemplate('guider/guider_view_profile.dust', user, function(text) {				  		
					        $(GuideImpl.guideContainer).append($.parseHTML(text));
					        
					        searchEl.hide("slide");
					        
						  	var cont1 = $(".gt-data-container-1 div.gt-data");

					          mApi().workspace.workspaces.read({ userId: uId}).callback(function(err, wps){						  	
							  	renderDustTemplate('guider/guider_view_profile_workspaces.dust',wps,function(text){
							  		$(cont1).append($.parseHTML(text));
							  		
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
					  	renderDustTemplate('guider/guider_item_details.dust', user, function(text) {				  		
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
				  openInSN('guider/guider_create_message.dust', user, createMessage );
		
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
	
	
});
