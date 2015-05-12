$(document).ready(function(){
	
    TaskImpl = $.klass({

    	init : function(){
    		// todo: parse url
          this.refreshTasks();	
    	    $(TaskImpl.taskContainer).on("click", '.tt-item:not(.open)', $.proxy(this.showUser,this));  
    	    $(TaskImpl.taskContainer).on("click", '.tt-tool-send-mail', $.proxy(this.messageToUser,this));    	    
          $('.tt-search').on('focus', '#taskToolSearch', $.proxy(this._onTaskFocus, this));
    	},
    	

      _onTaskFocus : function(event){
        
        $(event.target).autocomplete({
          source: function (request, response) {
            response(tasktool.filterTasks(request.term));
          },
          select: function (event, ui) {
            tasktool._selectRecipient(event, ui.item);
            $(this).val("");
            return false;
          }
        });             
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

	    
	    
     filterTasks : function(filterTerm){

         var _this = this;
         var users = new Array();
         var workspaces= new Array();         
       
         mApi().user.users.read({ 'searchString' : filterTerm }).callback(
          function (err, users) {
            for (var i = 0, l = users.length; i < l; i++) {
            var img = undefined;
              if (users[i].hasImage)
               img = CONTEXTPATH + "/picture?userId=" + result[i].id;
               users.push({
                 category: getLocaleText("plugin.communicator.users"),
                 label: users[i].firstName + " " + users[i].lastName,
                 id: users[i].id,
                 image: img,
                 type: "USER"
                });
              }
       });       
       
//       mApi().workspace.workspaces.read({ 'searchString' : searchTerm }).callback(
//           function (err, workspaces) {
//             for (var i = 0, l = workspaces.length; i < l; i++) {
//
//             }
//        });     
                   
         
     },

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
