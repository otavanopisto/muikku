(function() {
  
  CommunicatorWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      widgetElement = $(widgetElement);
      this._userId = widgetElement.find("input[name='userId']").val();
      this._communicatorContent = widgetElement.find(".communicatorContent");
      this._newMessageButton = widgetElement.find("input[name='communicatorNewMessageButton']");
      
//      this._tabsContainer = widgetElement.find('.communicatorTabs');
//      this._tabControl = new S2.UI.Tabs(this._tabsContainer);
      
      this._newMessageButton.click($.proxy(this._onNewMessageClick, this));
      
      this._showInbox();
    },
    deinitialize: function () {
      var _this = this;
      
//      Event.stopObserving(this._newMessageButton, 'click', this._onNewMessageClick);
//      
//      widgetElement.select('.communicatorMessage').forEach(function (messageElement) {
//        Event.stopObserving(messageElement, 'click', _this._entryElementClickListener);
//      });
    },
    _showInbox: function () {
      var _this = this;
      this._clearContent();
      
      RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/items", {
        parameters: {
          'userId': this._userId
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('communicator/communicator_items.dust', data, function (text) {
          _this._communicatorContent.append($.parseHTML(text));
          
          _this._communicatorContent.find('.communicatorMessage').click($.proxy(_this._onMessageClick, _this));
        });
      });
    },
    _clearContent: function () {
      this._communicatorContent.children().remove();
    },
    _onMessageClick: function (event) {
      var _this = this;
      this._clearContent();
      
      var element = $(event.target);
      element = element.parents(".communicatorMessage");
      var messageId = $(element).find("input[name='communicatorMessageIdId']").val();
      
      RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/messages/{messageId}", {
        parameters: {
          'userId': this._userId,
          'messageId': messageId
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('communicator/communicator_viewmessage.dust', response.responseJSON, function (text) {
          _this._communicatorContent.append($.parseHTML(text));
          
          _this._communicatorContent.find('.communicatorMessageReplyLink').click($.proxy(_this._onReplyMessageClick, _this));
          _this._communicatorContent.find('.communicatorMessageReplyAllLink').click($.proxy(_this._onReplyMessageClick, _this));
        });
      });
    },
    _onNewMessageClick: function (event) {
      var _this = this;
      this._clearContent();
      renderDustTemplate('communicator/communicator_newmessage.dust', undefined, function (text) {
        _this._communicatorContent.append($.parseHTML(text));
        
        _this._communicatorContent.find("input[name='send']").click($.proxy(_this._onPostMessageClick, _this));
        _this._communicatorContent.find("input[name='cancel']").click($.proxy(_this._onCancelMessageClick, _this));
        
        _this._communicatorContent.find("input[name='userInput']").click($.proxy(_this._onSearchUsersChange, _this));
        _this._communicatorContent.find("input[name='userInput']").on("keydown", $.proxy(_this._onSearchUsersChange, _this));
        _this._communicatorContent.find("input[name='userInput']").on("keyup", $.proxy(_this._onSearchUsersChange, _this));
      });
    },
    _onReplyMessageClick: function (event) {
      var _this = this;
      var element = $(event.target);
      var replyAll = element.hasClass("communicatorMessageReplyAllLink") || (element.parents(".communicatorMessageReplyAllLink") != undefined);
      
      element = element.parents(".communicatorMessageView");
      
      var communicatorMessageId = element.find("input[name='communicatorMessageId']").val();
      var communicatorMessageIdId = element.find("input[name='communicatorMessageIdId']").val();
      var recipients = new Array();
      
      if (replyAll) {
        RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/communicatormessages/{messageId}/recipients", {
          parameters: {
            'userId': this._userId,
            'messageId': communicatorMessageId
          }
        }).success(function (data, textStatus, jqXHR) {
          for (var i = 0, l = response.responseJSON.length; i < l; i++) {
            recipients.push({
              'id': response.responseJSON[i].recipient.id,
              'name': response.responseJSON[i].recipient.fullName
            });
          }
        });
      } else {
        RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/communicatormessages/{messageId}", {
          parameters: {
            'userId': this._userId,
            'messageId': communicatorMessageId
          }
        }).success(function (data, textStatus, jqXHR) {
          recipients.push({
            'id': response.responseJSON.sender.id,
            'name': response.responseJSON.sender.fullName
          });
        });
      }
      
      var prms = {
        communicatorMessageId: communicatorMessageIdId,
        subject: element.find(".communicatorMessageTitle").innerHTML,
        content: element.find(".communicatorMessageContent").innerHTML,
        recipients: recipients
      };
  
      renderDustTemplate('communicator/communicator_replymessage.dust', prms, function (text) {
        element.append($.parseHTML(text));
        
        _this._communicatorContent.find("input[name='send']").click($.proxy(_this._onPostReplyMessageClick, _this));
        _this._communicatorContent.find("input[name='cancel']").click($.proxy(_this._onCancelReplyClick, _this));
      });
    },
    _onCancelMessageClick: function (event) {
      var element = $(event.target);
      var newMessageElement = element.parents(".communicatorNewMessage");
      newMessageElement.remove();
      this._showInbox();
    },
    _onCancelReplyClick: function (event) {
      var element = $(event.target);
      var newMessageElement = element.parents(".communicatorNewMessage");
      newMessageElement.remove();
    },
    _onPostMessageClick: function (event) {
      var _this = this;
      var element = $(event.target);
      var newMessageElement = element.parents(".communicatorNewMessage");
      var recipientListElement = newMessageElement.find(".recipientsList");
      var recipientIds = new Array();
      
      $(recipientListElement.children(".recipient")).each(function (index) {
        recipientIds.push($(this).find("input[name='userId']").val());
      });
      
      RESTful.doPost(CONTEXTPATH + "/rest/communicator/{userId}/messages", {
        parameters: {
          'userId': this._userId,
          'subject': newMessageElement.find("input[name='subject']").val(),
          'content': newMessageElement.find("textarea[name='content']").val(),
          'recipients': recipientIds
        }
      }).success(function (data, textStatus, jqXHR) {
        _this._showInbox();
      });
    },
    _onPostReplyMessageClick: function (event) {
      var _this = this;
      var element = $(event.target);
      var newMessageElement = element.parents(".communicatorNewMessage");
      var recipientListElement = newMessageElement.find(".recipientsList");
      var recipientIds = new Array();
      
      $(recipientListElement.children(".recipient")).each(function (index) {
        recipientIds.push($(this).find("input[name='userId']").val());
      });
      
      var messageId = newMessageElement.find("input[name='communicatorMessageId']").val();
      
      RESTful.doPost(CONTEXTPATH + "/rest/communicator/{userId}/messages/{messageId}", {
        parameters: {
          'userId': this._userId,
          'messageId': messageId,
          'subject': newMessageElement.find("input[name='subject']").val(),
          'content': newMessageElement.find("textarea[name='content']").val(),
          'recipients': recipientIds
        }
      }).success(function (data, textStatus, jqXHR) {
        _this._showInbox();
      });
    },
    _onSearchUsersChange: function (event) {
      this._searchUsers(event);
    },
    _searchUsers: function (event) {
      var _this = this;
      var element = $(event.target);
      element = element.parents(".communicatorNewMessage");
      var recipientSelectorElement = element.find(".recipientSelector");
      
      RESTful.doGet(CONTEXTPATH + "/rest/user/searchUsers", {
        parameters: {
          'searchString': ""
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('communicator/communicator_userlist.dust', data, function (text) {
          recipientSelectorElement.children().remove();

          $(text).appendTo(recipientSelectorElement);
          
          recipientSelectorElement.find('.userSearchAutoCompleteUser').click($.proxy(_this._onSelectRecipientClick, _this));
        });
      });
    },
    _onSelectRecipientClick : function (event) {
      var _this = this;
      var element = $(event.target);
      
      var recipientElement = element.hasClass("userSearchAutoCompleteUser") ? element : element.parents(".userSearchAutoCompleteUser");
      var recipientListElement = element.parents(".communicatorNewMessage").find(".recipientsList"); 
      
      var prms = {
        id: recipientElement.find("input[name='userId']").val(),
        name: recipientElement.find("input[name='userName']").val()
      };
  
      renderDustTemplate('communicator/communicator_messagerecipient.dust', prms, function (text) {
        recipientListElement.append($.parseHTML(text));
        
        // TODO: tuplakuuntelijat?
        recipientListElement.find(".removeRecipient").click($.proxy(_this._onRemoveRecipientClick, _this));
      });
    },
    _onRemoveRecipientClick : function (event) {
      var element = $(event.target);
      if (!element.hasClass("recipient"))
        element = element.parents(".recipient");
      element.remove();
    }
  });
  
  addWidgetController('communicator', CommunicatorWidgetController);

}).call(this);