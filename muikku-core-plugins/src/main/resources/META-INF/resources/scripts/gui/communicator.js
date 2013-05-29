(function() {
  
  CommunicatorWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      widgetElement = $(widgetElement);
      
      this._userId = widgetElement.find("input[name='userId']").val();
      this._communicatorContent = widgetElement.find(".communicatorContent");
      this._newMessageButton = widgetElement.find("input[name='communicatorNewMessageButton']");
      
      this._tabsContainer = widgetElement.find('.communicatorTabs');
      this._tabsContainer.tabs();
      $('#menu').menu();
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
    _loadMessageTemplates: function () {
      var _data = [];
      
      RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/templates", {
        parameters: {
          'userId': this._userId
        }
      }).success(function (data, textStatus, jqXHR) {
        _data = data;
      });

      return _data;
    },
    _loadMessageSignatures: function () {
      var _data = [];
      
      RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/signatures", {
        parameters: {
          'userId': this._userId
        }
      }).success(function (data, textStatus, jqXHR) {
        _data = data;
      });
      
      return _data;
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
        renderDustTemplate('communicator/communicator_viewmessage.dust', data, function (text) {
          _this._communicatorContent.append($.parseHTML(text));
          
          _this._communicatorContent.find('.communicatorMessageReplyLink').click($.proxy(_this._onReplyMessageClick, _this));
          _this._communicatorContent.find('.communicatorMessageReplyAllLink').click($.proxy(_this._onReplyMessageClick, _this));
        });
      });
    },
    _onNewMessageClick: function (event) {
      var _this = this;
      this._clearContent();
      
      var templates = this._loadMessageTemplates();
      var signatures = this._loadMessageSignatures();
      
      var params = {
        templates: templates,
        signatures: signatures
      };
      
      renderDustTemplate('communicator/communicator_newmessage.dust', params, function (text) {
        _this._communicatorContent.append($.parseHTML(text));
        
        _this._communicatorContent.find("input[name='send']").click($.proxy(_this._onPostMessageClick, _this));
        _this._communicatorContent.find("input[name='cancel']").click($.proxy(_this._onCancelMessageClick, _this));
        
        _this._communicatorContent.find("input[name='userInput']").autocomplete({
          source: function (request, response) {
            response(_this._searchUsers(request.term));
          },
          select: function (event, ui) {
            _this._selectRecipient(event, ui.item.value, ui.item.label);
            $(this).val("");
            return false;
          }
        });
        
        _this._communicatorContent.find("select[name='templateSelector']").change($.proxy(_this._onSelectTemplate, _this));
        _this._communicatorContent.find("select[name='signatureSelector']").change($.proxy(_this._onSelectSignature, _this));
        _this._communicatorContent.find(".recipientsList").on("click", ".removeRecipient", $.proxy(_this._onRemoveRecipientClick, _this));
      });
    },
    _onSelectTemplate: function (event) {
      var element = $(event.target);
      var textarea = element.parents(".communicatorNewMessage").find("textarea[name='content']");
      var val = element.find("option:selected").val();
      
      if (val != "") {
        RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/templates/{templateId}", {
          parameters: {
            'userId': this._userId,
            templateId: val
          }
        }).success(function (data, textStatus, jqXHR) {
          textarea.val(data.content);
        });
      } else
        textarea.val("");
    },
    _onSelectSignature: function (event) {
      var element = $(event.target);
      var textarea = element.parents(".communicatorNewMessage").find("textarea[name='content']");
      var val = element.find("option:selected").val();
      
      if (val != "") {
        RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/signatures/{signatureId}", {
          parameters: {
            'userId': this._userId,
            signatureId: val
          }
        }).success(function (data, textStatus, jqXHR) {
          textarea.val(textarea.val() + "\n" + data.signature);
        });
      }
      
      element.val("");
    },
    _onReplyMessageClick: function (event) {
      var _this = this;
      var element = $(event.target);
      var replyAll = element.hasClass("communicatorMessageReplyAllLink") || (element.parents(".communicatorMessageReplyAllLink") != undefined);
      
      element = element.parents(".communicatorMessageView");
      
      var communicatorMessageId = element.find("input[name='communicatorMessageId']").val();
      var communicatorMessageIdId = element.find("input[name='communicatorMessageIdId']").val();
      var recipients = [];
      var templates = this._loadMessageTemplates();
      var signatures = this._loadMessageSignatures();
      
      if (replyAll) {
        RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/communicatormessages/{messageId}/recipients", {
          parameters: {
            'userId': this._userId,
            'messageId': communicatorMessageId
          }
        }).success(function (data, textStatus, jqXHR) {
          for (var i = 0, l = data.length; i < l; i++) {
            recipients.push({
              'id': data[i].recipient,
              'name': data[i].recipient_tq.fullName
            });
          }
        });
      }

      var subject = "";
      var content = "";
      
      RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/communicatormessages/{messageId}", {
        parameters: {
          'userId': this._userId,
          'messageId': communicatorMessageId
        }
      }).success(function (data, textStatus, jqXHR) {
        subject = data.caption;
        content = data.content;
        
        if (!replyAll) {
          recipients.push({
            'id': data.sender_tq.id,
            'name': data.sender_tq.fullName
          });
        }
      });
      
      var prms = {
        communicatorMessageId: communicatorMessageIdId,
        subject: subject,
        content: content,
        recipients: recipients,
        templates: templates,
        signatures: signatures
      };
  
      renderDustTemplate('communicator/communicator_replymessage.dust', prms, function (text) {
        element.append($.parseHTML(text));
        
        _this._communicatorContent.find("input[name='send']").click($.proxy(_this._onPostReplyMessageClick, _this));
        _this._communicatorContent.find("input[name='cancel']").click($.proxy(_this._onCancelReplyClick, _this));
        _this._communicatorContent.find("input[name='userInput']").autocomplete({
          source: function (request, response) {
            response(_this._searchUsers(request.term));
          },
          select: function (event, ui) {
            _this._selectRecipient(event, ui.item.value, ui.item.label);
            $(this).val("");
            return false;
          }
        });

        _this._communicatorContent.find("select[name='templateSelector']").change($.proxy(_this._onSelectTemplate, _this));
        _this._communicatorContent.find("select[name='signatureSelector']").change($.proxy(_this._onSelectSignature, _this));
        _this._communicatorContent.find(".recipientsList").on("click", ".removeRecipient", $.proxy(_this._onRemoveRecipientClick, _this));
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
      var recipientIds = [];
      
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
      var recipientIds = [];
      
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
    _searchUsers: function (searchTerm) {
      var _this = this;
      var users = new Array();

      RESTful.doGet(CONTEXTPATH + "/rest/user/searchUsers", {
        parameters: {
          'searchString': searchTerm
        }
      }).success(function (data, textStatus, jqXHR) {
        for (var i = 0, l = data.length; i < l; i++) {
          users.push({
            label: data[i].fullName,
            value: data[i].id
          });
        }
      });

      return users;
    },
    _selectRecipient: function (event, id, name) {
      var _this = this;
      var element = $(event.target);
      var recipientElement = element.hasClass("userSearchAutoCompleteUser") ? element : element.parents(".userSearchAutoCompleteUser");
      var recipientListElement = element.parents(".communicatorNewMessage").find(".recipientsList"); 
      
      var prms = {
        id: id,
        name: name
      };
  
      renderDustTemplate('communicator/communicator_messagerecipient.dust', prms, function (text) {
        recipientListElement.append($.parseHTML(text));
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