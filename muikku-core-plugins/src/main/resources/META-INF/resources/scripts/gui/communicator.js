	


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
      $('*[data-message-type="inbox"]').addClass('selected');      

      
      $(window).on("hashchange", $.proxy(this._onHashChange, this));
      
      $(window).trigger("hashchange");
    },
    _showNewMessageView : function () {
    },
    _showInbox : function () {
      this._setSelected("inbox");
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
      mApi().communicator.sentitems.read()
      .on('$', function (item, itemCallback) {
        item.caption = $('<div>').html(item.caption).text();
        item.content = $('<div>').html(item.content).text();
        
        // Lets fetch message recipients by their ids
        var recipients = item.recipientIds;
        var recipientNames = [];
        for (var i = 0; i < recipients.length; i++) {
         
          mApi().communicator.communicatormessages.recipients.info.read(item.id, recipients[i])
            .callback(function (err, user) {  
              recipientNames.push(user.firstName + ' ' + user.lastName);
              
              item.recipientHasPicture = user.hasImage;
            });
        
          item.recipientFullName = recipientNames;
        }

        mApi().communicator.messages.messagecount.read(item.communicatorMessageId)
          .callback(function (err, count) {
            item.messageCount = count;
          });

        itemCallback();
      })
      .callback(function (err, result) {
        renderDustTemplate('communicator/communicator_sent_items.dust', result, function (text) {
          $('.cm-messages-container').empty();
          $('.cm-messages-container').append($.parseHTML(text));
        });
      });      
      
    },
    _onMessageClick: function (event) {
      var element = $(event.target);
      element = element.parents(".cm-message");
      var cmId = element.find("input[name='communicatorMessageIdId']").val();

      var box = "#inbox";
      
      if (window.location.hash) {
        if (window.location.hash.indexOf("#sent") === 0)
          box = "#sent";
      }
      
      window.location.hash = box + "/" + cmId;
    },
    _onMessageBackClick: function (event) {
      var box = "#inbox";
      
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
		    name: item.label,
		    type: item.type
		  };

		  if (item.type == "USER") {
		    renderDustTemplate('communicator/communicator_messagerecipient.dust', prms, function (text) {
		      recipientListElement.prepend($.parseHTML(text));
		    });
		  } else if (item.type == "GROUP") {
        renderDustTemplate('communicator/communicator_messagerecipientgroup.dust', prms, function (text) {
          recipientListElement.prepend($.parseHTML(text));
        });
      }
	},
	_onRemoveRecipientClick : function (event) {
	  var element = $(event.target);
	  if (!element.hasClass("cm-message-recipient"))
	    element = element.parents(".cm-message-recipient");
	  element.remove();
	},    
	    
  _doSearch: function (searchTerm) {
	  var groups = this._searchGroups(searchTerm);
	  var users = this._searchUsers(searchTerm);
	  
	  return $.merge(groups, users);
//  	  return this._searchUsers(searchTerm);
  },    	

  _searchGroups: function (searchTerm) {
    var _this = this;
    var users = new Array();
  

    mApi().usergroup.groups.read({ 'searchString' : searchTerm }).callback(function(err, result) {
      if (result != undefined) {
        for (var i = 0, l = result.length; i < l; i++) {
          var img = undefined;
          if (result[i].hasImage)
            img = CONTEXTPATH + "/picture?userId=" + result[i].id;

          users.push({
            category : getLocaleText("plugin.communicator.usergroups"),
            label : result[i].name,
            id : result[i].id,
            image : img,
            type : "GROUP"
          });
        }
      }
    }); 
    
    return users;
  },

  _searchUsers: function (searchTerm) {
		var _this = this;
		var users = new Array();
	
		mApi().user.users.read({ 'searchString' : searchTerm }).callback(function(err, result) {
      if (result != undefined) {
        for (var i = 0, l = result.length; i < l; i++) {
          var img = undefined;
          if (result[i].hasImage)
            img = CONTEXTPATH + "/picture?userId=" + result[i].id;

          users.push({
            category : getLocaleText("plugin.communicator.users"),
            label : result[i].firstName + " " + result[i].lastName,
            id : result[i].id,
            image : img,
            type : "USER"
          });
        }
      }
    }); 
  	
  	return users;
	},
  
  _setSelected : function(selected){
    var container = $(".mf-list");
    var categories = container.find("li");
    
    categories.removeClass("selected");
    
    $('li[data-message-type='+ selected +']').addClass("selected");
    
    
  },
    _onHashChange: function (event) {
      var hash = window.location.hash.substring(1);
      var _this = this;
       
        if (hash.indexOf("inbox/") === 0) {
          var messageId = hash.substring(6);
          var hI = hash.indexOf('/');
          var cHash = hash.substring(0, hI);
          _this._showMessage(messageId);
          _this._setSelected(cHash);
        } else if (hash == "sent") {
          _this._showSentItems();
          _this._setSelected(hash);
        } else if (hash.indexOf("sent/") === 0) {
          var hI = hash.indexOf('/');          
          var cHash = hash.substring(0, hI );
          var messageId = hash.substring(5);
          _this._showMessage(messageId);
          _this._setSelected(cHash);
        } else
          _this._showInbox();

    }
    
  });

  window.mCommunicator = new CommunicatorImpl();
  
});
