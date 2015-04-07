$(document).ready(function(){
	
    GuideImpl = $.klass({

    	init : function(){
    		// todo: parse url
            this.refreshUsers();	
    	    $(GuideImpl.guideContainer).on("click", '.tt-item:not(.open)', $.proxy(this.showUser,this));  
    	    $(GuideImpl.guideContainer).on("click", '.tt-tool-send-mail', $.proxy(this.messageToUser,this));    	    
    	    
    	},
    	
    	
    	refreshItems : function(){

            this.clearUsers();
            var search = $(".gt-search");
            var searchVisible = search.is(":visible");
            
            if(searchVisible == false ){
            	search.show("slide");
            	
            }
            
 
//    	    
//    	    mApi().user.users.read({archetype : 'STUDENT'})
//    	    .callback(function (err, users) {
//    	  	  
//    		    if( err ){
//    		          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nousers', err));
//    		  	}else{    	  
//
//    		  	 renderDustTemplate('/tasktool/tasktool_items.dust', users, function(text) {
//    		 		$(GuideImpl.guideContainer).append($.parseHTML(text));
//    		 		
//    		  	});
//    		  	}
//    	    });		
    		
    	},
    	  	
	    showItem : function(event){

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
	    

	    clearItems : function(){
	    	$(TaskImpl.taskContainer).empty();
	    },	    
	    
//	    clearReplies : function(){
//	    	$(DiscImpl.subContainer).empty();
//		 },	  	    
//		 
	    _klass : {
	    	// Variables for the class
		  taskContainer : ".tt-tasks-view-container",

	    	  
	    	  
	    }
    
    
    }); 
	

   window.guider = new TaskImpl();
  
        
	$(".gt-main-dropdown-label").click(function(){
		alert("To da Evaluation!!!");   
	});
	
	
});
