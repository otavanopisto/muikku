	


$(document).ready(function(){

	
	$(".bt-mainFunction").click(function(){
		
		
		
		var sendMessage = function(values){
		  
		  delete values.recipient;
		  
      mApi().communicator.messages.create(values)
      .callback(function (err, result) {
      });
		}		
		

		openInSN('/communicator/communicator_create_message.dust', null, sendMessage);		
		

       
       
	})
	

  CommunicatorImpl = $.klass({
    init: function () {
      $('.cm-messages-container').on('click','.cm-message:not(.open)', $.proxy(this._onMessageClick, this));
      $('.cm-messages-container').on('click','.icon-goback', $.proxy(this._onMessageBackClick, this));
      $('#socialNavigation').on('focus', '#recipientContent', $.proxy(this._onRecipientFocus, this));
      $("#socialNavigation").on("click", ".cm-message-recipient-name", $.proxy(this._onRemoveRecipientClick, this));
      $(window).on("hashchange", $.proxy(this._onHashChange, this));
      
      $(window).trigger("hashchange");
    },
    _showNewMessageView : function () {
    },
    _showInbox : function () {
      mApi().communicator.items.read()
      .on('$', function (item, itemCallback) {
        item.caption = $('<div>').html(item.caption).text();
        item.content = $('<div>').html(item.content).text();
        
        mApi().communicator.communicatormessages.sender.read(item.id)
          .callback(function (err, user) {  
            item.senderFullName = user.firstName + ' ' + user.lastName;
            item.senderHasPicture = user.hasImage;
          });
        mApi().communicator.messages.messagecount.read(item.communicatorMessageId)
          .callback(function (err, count) {
            item.messageCount = count;
          });

        itemCallback();
      })
      .callback(function (err, result) {
        renderDustTemplate('communicator/communicator_items.dust', result, function (text) {
          $('.cm-messages-container').empty();
          $('.cm-messages-container').append($.parseHTML(text));
        });
      });
    },
    _showMessage : function (communicatorMessageId) {
      var mCont = $('.cm-messages-container');
      var _this = $(this); 
      
      mApi().communicator.messages.read(communicatorMessageId).callback(function (err, result) {
        for (var i = 0; i < result.length; i++) {
          result[i].caption = $('<div>').html(result[i].caption).text();
          result[i].content = $('<div>').html(result[i].content).text();
          
          var sId = result[i].id;
          mApi().communicator.communicatormessages.sender.read(sId)
            .callback(function (err, user) {  

            if (MUIKKU_LOGGED_USER_ID == user.id){
              result[i].isOwner = true;         
            } else {
              result[i].isOwner = false;    
            }               

            result[i].senderFullName = user.firstName + ' ' + user.lastName;
            result[i].senderHasPicture = user.hasImage;
          });
        } 
            
        renderDustTemplate('communicator/communicator_items_open.dust', result, function(text) {
          mCont.empty();
          mCont.append($.parseHTML(text));

          $(".cm-message-reply-link").click(function(event) {
            var element = $(event.target);
            element = element.parents(".cm-message");
            var eId = element.attr('id');
            var fCont = element.find('.cm-message-content-tools-reply-container');
            var tCont = element.find('.cm-message-content-tools-container');
            var messageId = element.find('input[name="communicatorMessageId"]').val();

            mApi().communicator.communicatormessages.read(eId).on('$', function(reply, replyCallback) {
              mApi().communicator.communicatormessages.sender.read(messageId).callback(function(err, user) {
                reply.senderFullName = user.firstName + ' ' + user.lastName;
                reply.senderHasPicture = user.hasImage;
              });

              replyCallback();
            })

            .callback(function(err, result) {
              renderDustTemplate('communicator/communicator_replymessage.dust', result, function(text) {

                tCont.hide();
                fCont.append($.parseHTML(text));

                var cBtn = $(fCont).find("input[name='cancel']");
                var sBtn = $(fCont).find("input[name='send']");

                $(sBtn).click(function() {
                  var cmId = $(fCont).find("input[name='communicatorMessageId']").val();
                  var subject = $(fCont).find("input[name='subject']").val();
                  var content = $(fCont).find("textarea[name='content']").val();
                  var tagStr = "tagi viesti"; // TODO: Tag content
                  var tags = tagStr != undefined ? tagStr.split(' ') : [];
                  var recipientIdStr = $(fCont).find("input[name='recipientIds']").val();
                  var recipientIds = recipientIdStr != undefined ? recipientIdStr.split(',') : [];
                  var groupIds = [];

                  mApi().communicator.messages.create(cmId, {
                    categoryName : "message",
                    caption : subject,
                    content : content,
                    tags : tags,
                    recipientIds : recipientIds,
                    recipientGroupIds : groupIds
                  }).callback(function(err, result) {
                  });

                  // Go to inbox
                  window.location.reload();
                });

                $(cBtn).click(function() {
                  tCont.show();
                  fCont.empty();

                });

              });
            });
          });
        });

        mApi().communicator.messages.markasread.create(communicatorMessageId).callback(function (err, result) {});
      });
    },
    _showSentItems : function () {
    },
    _showSettingsView : function () {
    },
    _onMessageClick: function (event) {
      var element = $(event.target);
      element = element.parents(".cm-message");
      var cmId = element.find("input[name='communicatorMessageIdId']").val();

      var box = "#in";
      
      if (window.location.hash) {
        if (window.location.hash.indexOf("#sent") === 0)
          box = "#sent";
      }
      
      window.location.hash = box + "/" + cmId;
    },
    _onMessageBackClick: function (event) {
      var box = "#in";
      
      if (window.location.hash) {
        if (window.location.hash.indexOf("#sent") === 0)
          box = "#sent";
      }
      
      window.location.hash = box;
      return false;
    },
    
    _onRecipientFocus:function(event){
      $(event.target).autocomplete({
      source: function (request, response) {
        response(mCommunicator._doSearch(request.term));
      },
      select: function (event, ui) {
    	mCommunicator._selectRecipient(event, ui.item);
        $(this).val("");
        return false;
      }
    });    	


    	
    }, 
 
	  _selectRecipient: function (event, item) {
		  var _this = this;
		  var element = $(event.target);
		  var recipientListElement = $("#msgRecipientsContainer"); 		  
		  var prms = {
		    id: item.id,
		    name: item.label
		  };

		  if (item.type == "USER") {
		    renderDustTemplate('communicator/communicator_messagerecipient.dust', prms, function (text) {
		    recipientListElement.prepend($.parseHTML(text));
		      
		      
		    });
		  } else {
		    // NOTHING ELSE! 
		  }
		    
	},
	_onRemoveRecipientClick : function (event) {
	  var element = $(event.target);
	  if (!element.hasClass("cm-message-recipient"))
	    element = element.parents(".cm-message-recipient");
	  element.remove();
	},    
	    
    _doSearch: function (searchTerm) {
//  	  var groups = this._searchGroups(searchTerm);
  	  var users = this._searchUsers(searchTerm);
  	  
//  	  return $.merge(groups, users);
  	  return this._searchUsers(searchTerm);
  },    	

	_searchUsers: function (searchTerm) {
		var _this = this;
		var users = new Array();
	
		mApi().user.users.read({ 'searchString' : searchTerm }).callback(
		 function (err, result) {
		   for (var i = 0, l = result.length; i < l; i++) {
			 var img = undefined;
	       if (result[i].hasImage)
	        img = CONTEXTPATH + "/picture?userId=" + result[i].id;
	        users.push({
	          category: getLocaleText("plugin.communicator.users"),
	          label: result[i].firstName + " " + result[i].lastName,
	          id: result[i].id,
	          image: img,
	          type: "USER"
	         });
	       }
	}); 
	
	return users;
	},
    _onHashChange: function (event) {
      var hash = window.location.hash.substring(1);
      var _this = this;
      
      if (hash == "new") {
        _this._showNewMessageView();
      } else if (hash == "settings") {
        _this._showSettingsView();
      } else if (hash.indexOf("in/") === 0) {
        var messageId = hash.substring(3);
        _this._showMessage(messageId);
      } else if (hash == "sent") {
        _this._showSentItems();
      } else if (hash.indexOf("sent/") === 0) {
        var messageId = hash.substring(5);
        _this._showMessage(messageId);
      } else
        _this._showInbox();
    }
  });

  window.mCommunicator = new CommunicatorImpl();
  
});
