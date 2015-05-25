(function() {
  
  $.widget("custom.records", {
    options: {
      userEntityId: null
    },
    
    _create : function() {
      this.element.on('click', '.tr-item', $.proxy(this._onItemClick, this));
      this.element.on('click', '.tr-view-toolbar .icon-goback', $.proxy(this._loadWorkspaces, this));      
      this._loadWorkspaces();
    },
    
    _loadWorkspaces: function () {
      this._clear();
      mApi().workspace.workspaces
      .read({ userId: this.options.userEntityId })
      .callback($.proxy(function (err, workspaces) {
        if( err ){
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.records.errormessage.noworkspaces', err));
        } else {
          renderDustTemplate('/records/records_items.dust', workspaces, $.proxy(function(text) {
            this.element.append(text);
          }, this));
        }
      }, this));
    },
    
    _loadWorkspace: function (workspaceEntityId) {
      this._clear();
      mApi().workspace.workspaces
      .read({ userId: this.options.userEntityId })
      .callback($.proxy(function (err, workspaces) {
        if( err ){
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.records.errormessage.noworkspaces', err));
        } else {
          renderDustTemplate('/records/records_item_open.dust', workspaces, $.proxy(function(text) {
            this.element.append(text);
          }, this));
        }
      }, this));
    },
    _onItemClick: function (event) {
      var workspaceEntityId = $(event.target).attr('data-workspace-entity-id');
      this._loadWorkspace(workspaceEntityId);
    },
    _clear: function(){
      this.element.empty();      
    },
    _destroy: function () {
      this.element.off('click', '.tr-item');
      this.element.off('click', '.tr-view-tool');
    }
  });
  
  $(document).ready(function(){
    $('.tr-records-view-container').records({
      userEntityId: MUIKKU_LOGGED_USER_ID
    });
  });
  
  
 /**

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
  
        

	
	
}); **/

}).call(this);

