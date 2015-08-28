
$(document).ready(function(){
  
  $(".bt-mainFunction").click(function(){
    var sendMessage = function(values){
      var _this = this;
      delete values.recipient;
      
      mApi().communicator.messages.create(values)
      .callback(function (err, result) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.infomessage.newMessage.error'));
        } else {
        $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.communicator.infomessage.newMessage.success'));
        }
      });
      window.mCommunicator._refreshView();
    }   

    openInSN('/communicator/communicator_create_message.dust', null, sendMessage);    
  });
  

  CommunicatorImpl = $.klass({
    init: function () {
      $(CommunicatorImpl.msgContainer).on('click','.cm-message:not(.open) .cm-message-details-container', $.proxy(this._onMessageClick, this));
      $(CommunicatorImpl.msgContainer).on('click','.icon-goback', $.proxy(this._onMessageBackClick, this));
      $(CommunicatorImpl.msgContainer).on('click','.icon-delete', $.proxy(this._onMessageDeleteClick, this));
      $(CommunicatorImpl.msgContainer).on('click','.cm-message-reply-link', $.proxy(this._replyMessage, this));
      $('#socialNavigation').on('focus', '#recipientContent', $.proxy(this._onRecipientFocus, this));
      $("#socialNavigation").on("click", ".cm-message-recipient-name", $.proxy(this._onRemoveRecipientClick, this));
      $("#socialNavigation").on("click", ".cm-message-recipient-name", $.proxy(this._onRemoveRecipientClick, this));
      $('*[data-message-type="inbox"]').addClass('selected');      

      dust.preload("communicator/communicator_item.dust");

      $(window).on("hashchange", $.proxy(this._onHashChange, this));
      
      $(window).trigger("hashchange");
      
      var _this = this;
      $(document).on("Communicator:newmessagereceived", function (event, data) {
        var hash = window.location.hash.substring(1);

        if ((hash == "") || (hash == "inbox")) {
          _this._showInbox();
        }
      });
    },

    _showInbox : function () {
      var _this = this;
      
      _this._addLoading(CommunicatorImpl.msgContainer);
      
      _this._setSelected("inbox");
      mApi().communicator.items.read().on('$', function (item, itemCallback) {
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
          $(CommunicatorImpl.msgContainer).empty();
          _this._clearLoading();
          $(CommunicatorImpl.msgContainer).append($.parseHTML(text));
        });
      });
    },
    _showMessage : function (communicatorMessageId) {
      var mCont = $(CommunicatorImpl.msgContainer);
      var _this = this; 
      
      _this._addLoading(CommunicatorImpl.msgContainer);
      
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
          _this._clearLoading();
          mCont.append($.parseHTML(text));
          

     
        });

        mApi().communicator.messages.markasread.create(communicatorMessageId).callback(function (err, result) {
          $(document).trigger("Communicator:messageread");
        });
      });
    },
    _showSentItems : function () {
      var _this = this;
      
      _this._addLoading(CommunicatorImpl.msgContainer);
      
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
          
          _this._clearLoading();
          $(CommunicatorImpl.msgContainer).empty();
          $(CommunicatorImpl.msgContainer).append($.parseHTML(text));
        });
      });      
      
    },
    _onMessageClick: function (event) {
      var element = $(event.target);
      element = element.parents(".cm-message");
      var cmId = element.find("input[name='communicatorMessageThreadId']").val();

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
    _onMessageDeleteClick : function(event) {
      
      var element = $(event.target);
      var parent = element.parents(".cm-messages-container");
      
      openElement = parent.find(".open");
     


      
      if(openElement.length > 0){
        var id = [openElement.attr("data-thread-id")];
        
        this._deleteMessages(id);
        this._onMessageBackClick();
      }else{
        var inputs = $(CommunicatorImpl.msgContainer).find("input:checked");    
        var deleteQ = [];
        for (i = 0; i < inputs.length; i++){
          var msgId = $(inputs[i]).attr("value");
          deleteQ.push(msgId);
        }         
        this._deleteMessages(deleteQ)
      }
      
      
      

    },    
    
    _deleteMessages : function(ids){
      var _this = this;
      for (i = 0; i < ids.length; i++){ 
        mApi().communicator.messages.del(ids[i]).callback(function (err, result){
         if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.infomessage.delete.error'));
          } else {
            $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.communicator.infomessage.delete.success'));
          }         
          _this._refreshView();
        });
        

      } 
    },
    
    _onRecipientFocus:function(event){
      $(event.target).autocomplete({
       create: function(event, ui){
        $('.ui-autocomplete').perfectScrollbar();
       },  
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
  _refreshView: function(){
    if (window.location.hash) {
      var hash = window.location.hash.substring(1);
      if (window.location.hash.indexOf("#sent") === 0){
        
        var messageId = hash.substring(5);
        if(messageId == ""){
          this._showSentItems();
        }else{
          this._showMessage(messageId);
          
        }
      }else{
        var messageId = hash.substring(6);
        if(messageId == ""){
          this._showInbox();
        }else{
          this._showMessage(messageId);
          
        }

        
      }

    } else{
      this._showInbox();
      
    }
  },
  _addLoading : function(parentEl){
    $(parentEl).append('<div class="mf-loading"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div></div>');  
    
  },
  
  _clearLoading : function() {
    var loadingDivs = $(CommunicatorImpl.msgContainer).find("div.mf-loading");    
    loadingDivs.remove();
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
//      return this._searchUsers(searchTerm);
  },      

  
  _replyMessage : function(event){
    
     var element = $(event.target);
     element = element.parents(".cm-message");
     var eId = element.attr('id');
     var threadId = element.find('input[name="communicatorMessageThreadId"]').val();
     var _this = this;
     var sendReply = function(values){
       var tId = threadId; 

       mApi().communicator.messages.create(tId, values).callback(function (err, result) {
         if (err) {
           $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.infomessage.newMessage.error'));
         } else {
          _this._showMessage(threadId); 
          $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.communicator.infomessage.newMessage.success'));
         }
        });
    }   
     mApi().communicator.communicatormessages.read(eId).on('$', function(reply, replyCallback) {
       mApi().communicator.communicatormessages.sender.read(eId).callback(function(err, user) {
         reply.senderFullName = user.firstName + ' ' + user.lastName;
         reply.senderHasPicture = user.hasImage;
       });
    
       replyCallback();
    }).callback(function(err, result) {
      openInSN('/communicator/communicator_replymessage.dust', result, sendReply);       
    });
    
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
    var recipients = new Array();
    var recipientListElement = $(".cm-message-recipients");      
    var existingRecipients = recipientListElement.find(".cm-message-recipient-name");

    for(var r = 0; r < existingRecipients.length; r++){
      var rId= $(existingRecipients[r]).attr("id");
      recipients.push(rId);
    }   
    
    mApi().user.users.read({ 'searchString' : searchTerm }).callback(function(err, result) {
      if (result != undefined) {
        for (var i = 0, l = result.length; i < l; i++) {
          var uId = result[i].id.toString();
          var inArr = $.inArray(uId, recipients); 
          if ( inArr == -1){                       
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

    },
    
    _klass : {
      // Variables for the class
      msgContainer : ".cm-messages-container",
    }

    
  });

  window.mCommunicator = new CommunicatorImpl();
  
});
