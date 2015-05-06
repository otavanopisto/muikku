$(document).ready(function(){
	
    TaskImpl = $.klass({

    	init : function(){
    		// todo: parse url
          this.refreshTasks();	
    	    $(TaskImpl.taskContainer).on("click", '.tt-item:not(.open)', $.proxy(this.showUser,this));  
    	    $(TaskImpl.taskContainer).on("click", '.tt-tool-send-mail', $.proxy(this.messageToUser,this));    	    
    	    
    	},
    	
    	
    	refreshTasks : function(){

            this.clearTasks();
            var search = $(".tt-search");
            var searchVisible = search.is(":visible");
            
            if(searchVisible == false ){
            	search.show("slide");
            	
            }
            mApi().assessmentrequest.assessmentrequests.read({'workspaceId' : 6 })
            .callback(function (err, asreq) {
              
              if( err ){
                    $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.tasktool.errormessage.notasks', err));
              }else{        

               renderDustTemplate('/tasktool/tasktool_items.dust', asreq, function(text) {
                 $(TaskImpl.taskContainer).append($.parseHTML(text));
              
              });
              }
            });     		
    	},
    	  	
	    showTask : function(event){

	    	var element = $(event.target); 
	        element = element.parents(".tt-task");
	        var uId = $(element).attr("id");
		    var det = element.find(".tt-task-details"); 
	        var detcont = element.find(".tt-task-details-content"); 

	    	$(element).removeClass("closed");
	    	$(element).addClass("open");
	    	$(det).css("display","block");	    				

		    mApi().user.users.read(uId).callback(function(err, user){
				    if( err ){
				        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nouser', err));
				  	}else{    	  
					  	renderDustTemplate('/tasktool/taskr_item_details.dust', user, function(text) {				  		
					  		$(detcont).append($.parseHTML(text));
					  	});
				  	}	
		    });  		
				
	    },
	    

	    clearTasks : function(){
	    	$(TaskImpl.taskContainer).empty();
	    },	    
	    
//	    clearReplies : function(){
//	    	$(DiscImpl.subContainer).empty();
//		 },	  	    

	    _klass : {
	    	// Variables for the class
		  taskContainer : ".tt-tasks-view-container",
	    }
    
    
    }); 
	

   window.tasktool = new TaskImpl();
  
        
	$(".tt-main-dropdown-label").click(function(){
		alert("To da Evaluation!!!");   
	});
	
	
});
