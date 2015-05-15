$(document).ready(function(){
	
    TaskImpl = $.klass({

    	init : function(){
    		// todo: parse url
          this.refreshTasks();	
    	    $(TaskImpl.taskContainer).on("click", '.tt-item:not(.open)', $.proxy(this.showUser,this));  
    	    $(TaskImpl.taskContainer).on("click", '.tt-tool-send-mail', $.proxy(this.messageToUser,this));    	    
          $(".tt-tasks-filters-container").on("click", 'span', $.proxy(this._removeFilter,this));          
    	    $('.tt-search').on('focus', '#taskToolSearch', $.proxy(this._onTaskFocus, this));

    	    $.widget( "custom.catcomplete", $.ui.autocomplete, {
    	      _create: function() {
    	        this._super();
    	        this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
    	      },
    	      _renderMenu: function( ul, items ) {
    	        var that = this,
    	          currentCategory = "";
    	        $.each( items, function( index, item ) {
    	          var li;
    	          var catLoc = getLocaleText('plugin.tasktool.filter.category.' + item.category);
    	          if ( item.category != currentCategory ) {
    	            ul.append( "<li class='ui-autocomplete-category'>" + catLoc + "</li>" );
    	            currentCategory = item.category;
    	          }
    	          li = that._renderItemData( ul, item );
    	          if ( item.category ) {
    	            li.attr( "aria-label", item.category + " : " + item.label );
    	          }
    	        });
    	      }
    	    });    	    
    	},

      _doSearch: function (searchTerm) {
//      var groups = this._searchGroups(searchTerm);
      var users = this._searchUsers(searchTerm);
      
//      return $.merge(groups, users);
      return this._searchUsers(searchTerm);
  },          	
  
  _selectFilterItem: function (event, item) {
    var _this = this;
    var element = $(event.target);
    var filterListElement = $(".tt-tasks-filters-container");      
    
    var prms = {
      id: item.id,
      name: item.label,
      type: item.type
    }

    if (item.type == "USER") {
       // Let's find all the existing filters - now that we can only have one 
      
        var uF = filterListElement.find("span[data-filter-category='USER']");
       
        // lets remove it 
        
        uF.remove();
        
        renderDustTemplate('tasktool/tasktool_filter.dust', prms, function (text) {
          filterListElement.append($.parseHTML(text));
          tasktool.applyFilter(item.id);
      });

    } else {
      // NOTHING ELSE! 
    }
      
  },

  _onTaskFocus : function(event){
    
    $(event.target).catcomplete({
      delay:0,
      source: function (request, response) {
        response(tasktool._doSearch(request.term));
      },
      select: function (event, ui) {
        tasktool._selectFilterItem(event, ui.item);
        $(this).val("");
        return false;
      }
    });             
  },    	
 
  _removeFilter : function(event){
    $(event.target).remove();     
    this.refreshTasks();
  },      
   
  
  applyFilter : function(uId){

    this.clearTasks();
    var search = $(".tt-search");


    mApi().assessmentrequest.assessmentrequestsforme.read({'userId': uId}).on('$', function(asreq, asreqcallback){
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
    	  	
	    
     _searchUsers : function(filterTerm){

         var _this = this;
         var users = new Array();
         var workspaces= new Array();         
         var filters = new Array();
         var filterListElement = $(".tt-tasks-filters-container");      
         var existingFilters = filterListElement.find("span");
         
         for(var f = 0; f < existingFilters.length; f++){
           var fId= $(existingFilters[f]).attr("id");
           filters.push(fId);
         }
         
         
         mApi().user.users.read({ 'searchString' : filterTerm }).callback(
          function (err, usr) {
            
            for (var i = 0, l = usr.length; i < l; i++) {
              var uId = usr[i].id.toString();
              var inArr = $.inArray(uId, filters); 
              if ( inArr == -1){             
                var img = undefined;
                  if (usr[i].hasImage)
                   img = CONTEXTPATH + "/picture?userId=" + usr[i].id;
                   users.push({
                     category: getLocaleText("plugin.communicator.users"),
                     label: usr[i].firstName + " " + usr[i].lastName,
                     id: usr[i].id,
                     image: img,
                     category: "USER"
                    });
              }
              }
       });       
       
//       mApi().workspace.workspaces.read({ 'searchString' : searchTerm }).callback(
//           function (err, workspaces) {
//             for (var i = 0, l = workspaces.length; i < l; i++) {
//
//             }
//        });     
                   
         return users;        
     },
     
     clearTasks : function(){
       $(TaskImpl.taskContainer).empty();
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
