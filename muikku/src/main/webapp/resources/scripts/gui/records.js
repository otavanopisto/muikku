$(document).ready(function(){
	
    RecordsImpl = $.klass({

    	init : function(){
    		// todo: parse url
          this._loadWorkspaces();	
    	    $(RecordsImpl.recordsContainer).on("click", '.tr-item)', $.proxy(this.loadWorkspace,this));  

    	},

  


       _loadWorkspace : function(event){
      
          this.clearContainer();
          alert("loadWorkspace!");
            
//            if( err ){
//             $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.tasktool.errormessage.notasks', err));
//            }else{        
//             renderDustTemplate('/records/record_item_open.dust', asreq, function(text) {
//               $(TaskImpl.taskContainer).append($.parseHTML(text));
//            
//             });
//            }
       
      },

  

      
    	_loadWorkspaces : function(){

            this.clearContainer();

              mApi().workspace.workspaces
                .read({ userId: MUIKKU_LOGGED_USER_ID })
                .callback( function (err, workspaces) {
                  if( err ){
                    $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.records.errormessage.noworkspaces', err));
                  }else{                    
                    renderDustTemplate('/records/records_items.dust', workspaces, function(text) {
                      $(RecordsImpl.recordsContainer).append($.parseHTML(text));
                   
                    });
                  }
                });
      

    	},
    	  	


     clearContainer : function(){
       $(RecordsImpl.recordsContainer).empty();
     },      

	    _klass : {
	    	// Variables for the class
		  recordsContainer : ".tr-records-view-container"
	    }
    
    
    }); 
	

   window.records = new RecordsImpl();
  
        

	
	
});
