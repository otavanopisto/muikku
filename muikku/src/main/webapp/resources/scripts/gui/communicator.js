
$(document).ready(function(){
  
  $(".bt-mainFunction").click(function(){
    var sendMessage = function(values){
    
      if (!values.recipientIds && !values.recipientGroupIds && !values.recipientStudentsWorkspaceIds && !values.recipientTeachersWorkspaceIds) {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.validation.norecipients'));
        return false;
      }
      if (values.caption.trim() === '') {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.validation.notitle'));
        return false;
      }
      if (values.content.trim() === '') {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.validation.nomessage'));
        return false;
      }      
      else {      
        delete values.recipient;
        
        mApi({async: false}).communicator.messages.create(values)
          .callback(function (err, result) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.infomessage.newMessage.error'));
            } else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.communicator.infomessage.newMessage.success'));
            }
          });
        
        window.location.reload(true);
      }
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
      $(CommunicatorImpl.msgContainer).on("click", '.cm-page-link-load-more:not(.disabled)', $.proxy(this._onMoreClick, this));                
      $('*[data-message-type="inbox"]').addClass('selected');      

//      dust.preload("communicator/communicator_item.dust");

      $(window).on("hashchange", $.proxy(this._onHashChange, this));
      
      $(window).trigger("hashchange");
      
      $(document).on("Communicator:newmessagereceived", $.proxy(function (event, data) {
        var hash = window.location.hash.substring(1);

        if ((hash == "") || (hash == "inbox")) {
          this._showInbox();
        }
      }, this));
    },

    _showInbox : function () {
      $(CommunicatorImpl.msgContainer).empty();      
      this._addLoading(CommunicatorImpl.msgContainer);
      
      this._setSelected("inbox");
      mApi().communicator.items.read()
        .on('$', function (item, itemCallback) {
          item.caption = $('<div>').html(item.caption).text();
          item.content = $('<div>').html(item.content).text();
          
          mApi().communicator.communicatormessages.sender.read(item.id)
            .callback(function (err, user) {  
              item.senderFullName = user.firstName + ' ' + user.lastName;
              item.senderHasPicture = user.hasImage;
              
              mApi().communicator.messages.messagecount.read(item.communicatorMessageId)
                .callback(function (err, count) {
                  item.messageCount = count;
                  itemCallback();
                });
            });
        })
        .callback($.proxy(function (err, result) {
          result.msgLoadCount = result.length;
          renderDustTemplate('communicator/communicator_items.dust', result, $.proxy(function (text) {
            this._clearLoading();
            $(CommunicatorImpl.msgContainer).append($.parseHTML(text));
          }, this));
        }, this));
      
    },
    
    _showMessage : function (communicatorMessageId) {
      var mCont = $(CommunicatorImpl.msgContainer);
      this._addLoading(CommunicatorImpl.msgContainer);
      
      mApi({async: false}).communicator.messages
        .read(communicatorMessageId)
        .on("$", function (message, messageCallback) {
          
          mApi({async: false}).communicator.communicatormessages.sender.read(message.id).callback(function (err, user) {  
            if(err){
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.showmessage.thread.error'));
            }else{            
              message.isOwner = MUIKKU_LOGGED_USER_ID === user.id;
              message.senderFullName = user.firstName + ' ' + user.lastName;
              message.senderHasPicture = user.hasImage;
              message.caption = $('<div>').html(message.caption).text();
              message.content = message.content;
              messageCallback();
            }
          });
        })
        .callback($.proxy(function (err, messages) {
          
          // TODO: Recipients issue no: #875 
          
          if(err){
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.showmessage.thread.error'));
          }else{
            renderDustTemplate('communicator/communicator_items_open.dust', messages, $.proxy(function(text) {
              this._clearLoading();
              mCont.empty();
              mCont.append($.parseHTML(text));

              mApi({async: false}).communicator.messages.markasread.create(communicatorMessageId).callback($.proxy(function (err, result) {
                $(document).trigger("Communicator:messageread");
              }, this));               
           }, this));
         }         
      }, this));
    },
 
    _showSentItems : function () {
      $(CommunicatorImpl.msgContainer).empty();
      this._addLoading(CommunicatorImpl.msgContainer);
      
      mApi().communicator.sentitems
        .read()
        .on('$', function (item, itemCallback) {
          item.caption = $('<div>').html(item.caption).text();
          item.content = $('<div>').html(item.content).text();
          item.recipientCount = (item.recipientIds||[]).length;
          var recipients = (item.recipientIds||[]).splice(0, 5);
          
          // Lets fetch message recipients by their ids
        
          var calls = $.map(recipients, function(recipient){
            return mApi().communicator.communicatormessages.recipients.info.read(item.id, recipient);
          });
          
          mApi().batch(calls).callback(function(err, results){
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              item.recipients = $.map(results, function (result) {
                return {
                  fullName: result.firstName + ' ' + result.lastName,
                  firstName: result.firstName,
                  hasPicture: result.hasImage
                };
              });
              
              mApi().communicator.messages.messagecount.read(item.communicatorMessageId)
                .callback(function (err, count) {
                  item.messageCount = count;
                  itemCallback();
                });
            }
          });
        })
        .callback($.proxy(function (err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.infomessage.sent.loaderror'));
          } else {
            result.msgLoadCount = result.length;
            
            renderDustTemplate('communicator/communicator_sent_items.dust', result, $.proxy(function (text) {
              this._clearLoading();
              $(CommunicatorImpl.msgContainer).empty();
              $(CommunicatorImpl.msgContainer).append($.parseHTML(text));
            }, this));
          }
        }, this));      
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
        this._deleteMessages(id, false);
        this._onMessageBackClick();
        window.location.reload(true);        
      }else{
        var inputs = $(CommunicatorImpl.msgContainer).find("input:checked");    
        var deleteQ = [];
        for (i = 0; i < inputs.length; i++){
          var msgId = $(inputs[i]).attr("value");
          deleteQ.push(msgId);
        }         
        if(deleteQ.length != 0){
          this._deleteMessages(deleteQ)
        }
      }
    },    
    
    _deleteMessages : function(ids, reload){
      var messages = ids.length;
      var endpoint = mApi({async: false}).communicator.items;
      var hash = window.location.hash != '' ? window.location.hash.substring(1) : "none";
      var loadNotification = $('.notification-queue').notificationQueue('notification', 'loading', getLocaleText('plugin.communicator.infomessage.delete.deleting', messages));
      reload = (reload == undefined) ?  true : reload;
      
      if (hash == "sent") {
        endpoint = mApi({async: false}).communicator.sentitems;
      }

      var batch = $.map(ids, function(id){
        return endpoint.del(id);
        
      });
      
      mApi({async: false}).batch(batch).callback($.proxy(function(err){
        $('.notification-queue').notificationQueue('remove', loadNotification);
        
        if (err) {
         $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.infomessage.delete.error'));
        } else {
          $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.communicator.infomessage.delete.success'));
          if(reload === true){
           window.location.reload(true);
          }
        }
      }, this));
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
      } else if (item.type == "WORKSPACE") {
        renderDustTemplate('communicator/communicator_messagerecipientworkspace.dust', prms, function (text) {
          recipientListElement.prepend($.parseHTML(text));
        });
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

    var workspaces = this._searchWorkspaces(searchTerm);
    var groups = this._searchGroups(searchTerm);
    var users = this._searchUsers(searchTerm);
    var recipients = users.concat(workspaces, groups);
    
    
 
    
    
    return recipients;
  },      

  
  _replyMessage : function(event){
    
     var element = $(event.target);
     element = element.parents(".cm-message");
     var eId = element.attr('id');
     var threadId = element.find('input[name="communicatorMessageThreadId"]').val();
     var _this = this;
     var sendReply = function(values){
       var tId = threadId; 

       mApi({async: false}).communicator.messages.create(tId, values).callback(function (err, result) {
         if (err) {
           $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.infomessage.newMessage.error'));
         } else {
          _this._showMessage(threadId); 
          $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.communicator.infomessage.newMessage.success'));
         }
        });
     }   
     mApi({async: false}).communicator.communicatormessages.read(eId).on('$', function(reply, replyCallback) {
       mApi({async: false}).communicator.communicatormessages.sender.read(eId).callback(function(err, user) {
         reply.senderFullName = user.firstName + ' ' + user.lastName;
         reply.senderHasPicture = user.hasImage;
       });
    
       replyCallback();
    }).callback(function(err, result) {
      openInSN('/communicator/communicator_replymessage.dust', result, sendReply);       
    });
    
  },

  _searchWorkspaces: function (searchTerm) {
    var _this = this;
    var workspaces = new Array();

    mApi({async: false}).coursepicker.workspaces.read({
      search: searchTerm,
      myWorkspaces: true,
    })
    .callback($.proxy(function (err, result) {
      if (result != undefined) {
        for (var i = 0, l = result.length; i < l; i++) {
          var img = undefined;
          if (result[i].hasImage)
            img = CONTEXTPATH + "/picture?userId=" + result[i].id;
    
          workspaces.push({
            category : getLocaleText("plugin.communicator.workspaces"),
            label : result[i].name + (result[i].nameExtension ? ' (' + result[i].nameExtension + ')' : ''),
            id : result[i].id,
            type : "WORKSPACE"
          });
        }
      }      

    }, this));        
    
    return workspaces;
  },  
  _searchGroups: function (searchTerm) {
    var _this = this;
    var groups = new Array();
  
    if (MUIKKU_LOGGEDINROLES.admin || MUIKKU_LOGGEDINROLES.manager || MUIKKU_LOGGEDINROLES.teacher) {
      mApi({async: false}).usergroup.groups.read({ 'searchString' : searchTerm }).callback(function(err, result) {
        if (result != undefined) {
          for (var i = 0, l = result.length; i < l; i++) {
            var img = undefined;
            if (result[i].hasImage)
              img = CONTEXTPATH + "/picture?userId=" + result[i].id;
  
            groups.push({
              category : getLocaleText("plugin.communicator.usergroups"),
              label : result[i].name + " (" + result[i].userCount + ")",
              id : result[i].id,
              image : img,
              type : "GROUP"
            });
          }
        }
      });
    }
    
    return groups;
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
    
    mApi({async: false}).user.users.read({ 'searchString' : searchTerm }).callback(function(err, result) {
      if (result != undefined) {
        for (var i = 0, l = result.length; i < l; i++) {
          var uId = result[i].id.toString();
          var inArr = $.inArray(uId, recipients); 
          if ( inArr == -1){                       
            var img = undefined;
            if (result[i].hasImage)
              img = CONTEXTPATH + "/picture?userId=" + result[i].id;
  
            var label = result[i].firstName + " " + result[i].lastName;
            
            if (result[i].email)
              label = label + " (" + result[i].email + ")"
            
            users.push({
              category : getLocaleText("plugin.communicator.users"),
              label : label,
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
    var container = $(".mf-list-container");
    var categories = container.find("li");
    
    categories.removeClass("selected");
    
    $('li[data-message-type='+ selected +']').addClass("selected");
    
    
  },
  
  _onMoreClick : function(event){
    var element = $(event.target);
    var box = window.location.hash ? window.location.hash.substring(1) : "none";
    element = element.parents(".cm-messages-paging");
    var pageElement = $(".cm-messages-pages");
    var _this = this;  

    $(element).remove(); 
    this._addLoading(pageElement);
    


    var msgs = $(CommunicatorImpl.msgContainer).find('.cm-message');
    var msgsCount = msgs.length;

    switch(box) {
      case "sent":
        mApi({async: false}).communicator.sentitems.read({'firstResult' : msgsCount})
        .on('$', $.proxy(function (item, itemCallback) {
          item.caption = $('<div>').html(item.caption).text();
          item.content = $('<div>').html(item.content).text();
          
          // Lets fetch message recipients by their ids
          var recipients = item.recipientIds;
          
          var calls = $.map(recipients, function(recipient){
            return mApi({async: false}).communicator.communicatormessages.recipients.info.read(item.id, recipient);
          });
            
          mApi({async: false}).batch(calls).callback($.proxy(function(err, results){
            item.recipients = $.map(results, function (result) {
              return {
                fullName: result.firstName + ' ' + result.lastName,
                hasPicture: result.hasImage,
                firstName: result.firstName
              };
            });
            
            mApi({async: false}).communicator.messages.messagecount.read(item.communicatorMessageId)
              .callback($.proxy(function (err, count) {
                item.messageCount = count;
                itemCallback();
              }, this));            
            
          }, this));
        }, this))
        .callback($.proxy(function (err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nousers', err));
          } else {
            result.msgLoadCount = result.length;
            renderDustTemplate('communicator/communicator_sent_page.dust', result, $.proxy(function (text) {
              this._clearLoading();
              pageElement.append($.parseHTML(text));
            }, this));
          }
        }, this));      
      break;
      default:
        mApi({async: false}).communicator.items.read({'firstResult' : msgsCount}).on('$', function (item, itemCallback) {
          item.caption = $('<div>').html(item.caption).text();
          item.content = $('<div>').html(item.content).text();
          
          mApi({async: false}).communicator.communicatormessages.sender.read(item.id)
            .callback(function (err, user) {  
              item.senderFullName = user.firstName + ' ' + user.lastName;
              item.senderHasPicture = user.hasImage;
              
              mApi({async: false}).communicator.messages.messagecount.read(item.communicatorMessageId)
              .callback(function (err, count) {
                item.messageCount = count;
                itemCallback();
              });
          });
        })
        .callback($.proxy(function (err, msgs) {
          // TODO : what if 25 users and no more? 
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nousers', err));
          } else {
            msgs.msgLoadCount = msgs.length;
            
            this._clearLoading();
            renderDustTemplate('/communicator/communicator_page.dust', msgs, function(text) {
              pageElement.append($.parseHTML(text));
            });
          }
        }, this));
      }    
    },
    
    _onHashChange: function (event) {
      var hash = window.location.hash ? window.location.hash.substring(1) : "none";
      if (hash.indexOf("inbox/") === 0) {
        var messageId = hash.substring(6);
        var hI = hash.indexOf('/');
        var cHash = hash.substring(0, hI);
        this._showMessage(messageId);
        this._setSelected(cHash);
      } else if (hash == "sent") {
        this._showSentItems();
        this._setSelected(hash);
      } else if (hash.indexOf("sent/") === 0) {
        var hI = hash.indexOf('/');          
        var cHash = hash.substring(0, hI );
        var messageId = hash.substring(5);
        this._showMessage(messageId);
        this._setSelected(cHash);
      } else {
        this._showInbox();
      }
    },
    
    _klass : {
      // Variables for the class
      msgContainer : ".cm-messages-container",
    }

    
  });

  window.mCommunicator = new CommunicatorImpl();
  
});
