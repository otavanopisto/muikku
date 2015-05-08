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
            mApi().assessmentrequest.assessmentrequestsforme.read().on('$', function(asreq, asreqcallback){
              mApi().user.users.read(asreq.id).callback(function (err, user){
                if( err ){
                  $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.tasktool.errormessage.users', err));
                }else{        
                  asreq.username = user.firstName + ' ' + user.lastName;
                  
                }               
                
                
              });  

              mApi().workspace.workspaces.read(asreq.workspaceId).callback(function (err, workspace){
                if( err ){
                  $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.tasktool.errormessage.noworkspaces', err));
                }else{        
                  asreq.workspacename = workspace.name;    
    
                }               
                
                
              });
              
              asreqcallback();
              
            })
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
