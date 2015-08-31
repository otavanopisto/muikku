$(document).ready(function(){
	
    GuideImpl = $.klass({

    	init : function(){
          this._refreshUsers();
    	    $(GuideImpl.guideContainer).on("click", '.gt-user:not(.open)', $.proxy(this._showUser,this));  
          $(GuideImpl.guideContainer).on("click", '.gt-user.open .gt-user-name', $.proxy(this._hideUser,this));  
    	    $(GuideImpl.guideContainer).on("click", '.gt-tool-view-profile', $.proxy(this._onShowProfileClick,this));
    	    $(GuideImpl.guideContainer).on("click", '.gt-tool-send-mail', $.proxy(this.messageToUser,this));    	    
    	    
          dust.preload("guider/guider_item.dust");
          
          $(window).on("hashchange", $.proxy(this._onHashChange, this));
          $(window).trigger("hashchange");          
          
    	},
    	
    	
    	_refreshUsers : function(){
            var _this = this;
            _this._clearUsers();
            _this._addLoading($(GuideImpl.guideContainer));
            var search = $(".gt-search");
            var searchVisible = search.is(":visible");
            
            if(searchVisible == false ){
            	search.show("slide");
            }
            
    	    mApi().user.users.read({ archetype : 'STUDENT', maxResults: 25 })
    	    .callback(function (err, users) {
    	  	  
    		    if( err ){
    		          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nousers', err));
    		  	}else{    	  

    		  	 renderDustTemplate('guider/guider_items.dust', users, function(text) {
    		  	   _this._clearLoading();
      		 		$(GuideImpl.guideContainer).append($.parseHTML(text));
      		 		 
      		  	});
    		  	}
    	    });		
    		
    	},
    	_onShowProfileClick : function(event){
        var element = $(event.target); 
        element = element.parents(".gt-user");
        var uId = $(element).attr("id");
        window.location.hash = "userprofile/" + uId;    	  
    	},
    	
	    _viewUserProfile : function(uId){
	      this._clearUsers();
		    mApi().user.users.read(uId).callback(function(err, user){
				    if( err ){
				        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nouser', err));
				  	}else{    	  
					  	renderDustTemplate('guider/guider_view_profile.dust', user, function(text) {				  		
					        $(GuideImpl.guideContainer).append($.parseHTML(text));
					        
//					        searchEl.hide("slide");
					        
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
	    _showUser : function(event){
        var _this = this;
	    	var element = $(event.target); 
	      element = element.parents(".gt-user");
	      var uId = $(element).attr("id");
		    var det = element.find(".gt-user-details"); 
	      var detCont = element.find(".gt-user-details-content"); 
        var detCloseDiv = element.find(".gt-user-name");
	    	$(element).addClass("open");
	    	_this._addLoading(detCont);
	    	$(det).show();	   
	    	

		    
        mApi().user.users.read(uId).callback(function(err, user){
				    if( err ){
				        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nouser', err));
				  	}else{    	  
				  	  renderDustTemplate('guider/guider_item_details.dust', user, function(text) {				  		
					  		_this._clearLoading();
				  	    $(detCont).append($.parseHTML(text));				
					  	});
				  	}	
		    });  		

	    },
      _hideUser : function(event){

        var element = $(event.target); 
        element = element.parents(".gt-user");
        var det = element.find(".gt-user-details"); 
        var detcont = element.find(".gt-user-details-content"); 


        $(element).removeClass("open");
        $(detcont).empty();             
        $(det).hide();     
        

      },	    
	    
//	   messageToUser : function(event){
//		   
//			var element = $(event.target); 
//			element = element.parents(".gt-user");
//			var uId = $(element).attr("id");
//
//		   
//			var createMessage = function(values){
//
//				for(value in values){
//					  if(value == "recipienIds"){
//					  var recipientIds = values[value];
//					  delete values[value];
//				  }    	
//				 }				
////	               	categoryName: "message",
////	                caption : subject,
////	                content : content,
////	                tags : tags,
////	                recipientId : recipientId,
////	                recipientGroupIds : groupIds				
//				
//	            mApi().communicator.messages.create(recipientIds,values)
//	              .callback(function (err, result) {
//	              });
//
//			}	
//				
//		    mApi().user.users.read(uId)
//		      .callback(function (err, user) {
//		      	if( err ){
//		          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noareas', err));
//		    	}else{ 		
//				  openInSN('guider/guider_create_message.dust', user, createMessage );
//		
//		    	}
//		      });		   
//	   }, 

	   _addLoading : function(parentEl){
	     $(parentEl).append('<div class="mf-loading"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div></div>');  
	     
	   },
	   
	   _clearLoading : function() {
	     var loadingDivs = $(GuideImpl.guideContainer).find("div.mf-loading");    
	     loadingDivs.remove();
	   },    	   
	    _clearUsers : function(){
	    	$(GuideImpl.guideContainer).empty();
	    },	    
	    
	    _onHashChange: function (event) {
	      var hash = window.location.hash.substring(1);
	      var _this = this;
	       
	        if (hash.indexOf("userprofile/") === 0) {
	          var studentId = hash.substring(12);
	          var hI = hash.indexOf('/');
	          var cHash = hash.substring(0, hI);
	          _this._viewUserProfile(studentId);
	        }else
	          _this._refreshUsers;

	    },
	    _klass : {
	    	// Variables for the class
		  guideContainer : ".gt-students-view-container",

	    	  
	    	  
	    }
    
    
    }); 
	

   window.guider = new GuideImpl();
  
        
	$(".gt-main-dropdown-label").click(function(){
		 window.guider._refreshUsers();   
     window.location.hash = "";    
	});
	
	
});
