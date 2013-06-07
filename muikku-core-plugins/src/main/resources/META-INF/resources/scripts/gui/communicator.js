$.widget("custom.communicatorautocomplete", $.ui.autocomplete, {
  _renderMenu: function(ul, items) {
    var _this = this;
    var currentCategory = "";
  
    $.each(items, function(index, item) {
      if (item.category != currentCategory) {
        if (item.category)
          ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
        currentCategory = item.category;
      }
      _this._renderItemData(ul, item);
    });
  },
  _renderItem: function(ul, item) {
    var imageUrl = "/muikku/themes/default/gfx/fish.jpg";
    if (item.image)
      imageUrl = item.image;
    
    var inner_html = 
      '<a><div class="communicator_autocomplete_item_container">' + 
      '<div class="communicator_autocomplete_item_image"><img src="' + imageUrl + '"></div>' +
      '<div class="communicator_autocomplete_item_label">' + item.label + '</div></div></a>';
    return $( "<li></li>" ).data( "item.autocomplete", item ).append(inner_html).appendTo( ul );
  }
});

$.fn.extend({
  /**
   * Thanks to
   * https://github.com/Kasheftin/jquery-textarea-caret/blob/master/jquery.textarea.caret.js
   */
  
  insertAtCaret: function(myValue) {
    return this.each(function(i) {
      if (document.selection) {
        this.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        this.focus();
      }
      else 
      if (this.selectionStart || this.selectionStart == "0") {
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        var scrollTop = this.scrollTop;
        this.value = this.value.substring(0,startPos) + myValue + this.value.substring(endPos,this.value.length);
        this.focus();
        this.selectionStart = startPos + myValue.length;
        this.selectionEnd = startPos + myValue.length;
        this.scrollTop = scrollTop;
      }
      else {
        this.value += myValue;
        this.focus();
      }
    }
  )}
});

(function() {
  
  CommunicatorWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      var _this = this;
      widgetElement = $(widgetElement);
      
      this._userId = widgetElement.find("input[name='userId']").val();
      this._communicatorContent = widgetElement.find(".cm-content");
      this._newMessageButton = widgetElement.find("input[name='communicatorNewMessageButton']");
      
      this._tabsContainer = widgetElement.find('.communicatorTabs');
      this._tabsContainer.tabs();
      $('#menu').menu({
        select: function (event, ui) {
          var a = $(ui.item).find("a");
          
          window.location.hash = a.attr("href");
          
          return false;
        }
      });
      this._newMessageButton.click($.proxy(this._onNewMessageClick, this));
      
      $(window).on("hashchange", function (event) {
        var hash = window.location.hash.substring(1);
        
        if (hash == "new") {
          _this._showNewMessageView();
        } else if (hash == "settings") {
          _this._showSettingsView();
        } else
          _this._showInbox();
      });
      
      $(window).trigger("hashchange");
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
          
          _this._communicatorContent.find('.cm-message').click($.proxy(_this._onMessageClick, _this));
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
      element = element.parents(".cm-message");
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
    _showNewMessageView: function () {
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
        
        _this._communicatorContent.find("input[name='userInput']").communicatorautocomplete({
          source: function (request, response) {
            response(_this._doSearch(request.term));
          },
          select: function (event, ui) {
            _this._selectRecipient(event, ui.item.id, ui.item.label);
            $(this).val("");
            return false;
          }
        });
        
        _this._communicatorContent.find("select[name='templateSelector']").change($.proxy(_this._onSelectTemplate, _this));
        _this._communicatorContent.find("select[name='signatureSelector']").change($.proxy(_this._onSelectSignature, _this));
        _this._communicatorContent.find(".cm-newMessage-recipientsList").on("click", ".cm-newMessage-removeRecipient", $.proxy(_this._onRemoveRecipientClick, _this));
      });
    },
    _onNewMessageClick: function (event) {
      window.location.hash = "#new";
    },
    _onSelectTemplate: function (event) {
      var element = $(event.target);
      var textarea = element.parents("cm-newMessage").find("textarea[name='content']");
      var val = element.find("option:selected").val();
      
      if (val != "") {
        RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/templates/{templateId}", {
          parameters: {
            'userId': this._userId,
            templateId: val
          }
        }).success(function (data, textStatus, jqXHR) {
          textarea.insertAtCaret(data.content);
        });
      }
    },
    _onSelectSignature: function (event) {
      var element = $(event.target);
      var textarea = element.parents(".cm-newMessage").find("textarea[name='content']");
      var val = element.find("option:selected").val();
      
      if (val != "") {
        RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/signatures/{signatureId}", {
          parameters: {
            'userId': this._userId,
            signatureId: val
          }
        }).success(function (data, textStatus, jqXHR) {
          textarea.insertAtCaret(data.signature);
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
        _this._communicatorContent.find("input[name='userInput']").communicatorautocomplete({
          source: function (request, response) {
            response(_this._doSearch(request.term));
          },
          select: function (event, ui) {
            _this._selectRecipient(event, ui.item.id, ui.item.label);
            $(this).val("");
            return false;
          }
        });

        _this._communicatorContent.find("select[name='templateSelector']").change($.proxy(_this._onSelectTemplate, _this));
        _this._communicatorContent.find("select[name='signatureSelector']").change($.proxy(_this._onSelectSignature, _this));
<<<<<<< HEAD
        _this._communicatorContent.find(".cm-newMessage-recipientsList").on("click", ".cm-newMessage-removeRecipient", $.proxy(_this._onRemoveRecipientClick, _this));
=======
        _this._communicatorContent.find(".cm-recipientsList").on("click", ".removeRecipient", $.proxy(_this._onRemoveRecipientClick, _this));
>>>>>>> 216db964be9c650b70b7d24d1698323658f4aef8
      });
    },
    _onCancelMessageClick: function (event) {
      var element = $(event.target);
      var newMessageElement = element.parents(".cm-newMessage");
      newMessageElement.remove();
      this._showInbox();
    },
    _onCancelReplyClick: function (event) {
      var element = $(event.target);
      var newMessageElement = element.parents(".cm-newMessage");
      newMessageElement.remove();
    },
    _onPostMessageClick: function (event) {
      var _this = this;
      var element = $(event.target);
      var newMessageElement = element.parents(".cm-newMessage");
      var recipientListElement = newMessageElement.find(".cm-newMessage-recipientsList");
      var recipientIds = [];
      
      $(recipientListElement.children(".cm-newMessage-recipient")).each(function (index) {
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
      var newMessageElement = element.parents(".cm-newMessage");
      var recipientListElement = newMessageElement.find(".cm-newMessage-recipientsList");
      var recipientIds = [];
      
      $(recipientListElement.children(".cm-newMessage-recipient")).each(function (index) {
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
            category: "Käyttäjät",
            label: data[i].fullName,
            id: data[i].id
          });
        }
      });

      return users;
    },
    _searchGroups: function (searchTerm) {
      var _this = this;
      var groups = new Array();
      groups.push({
        category: "Ryhmät",
        label: "Opettajat",
        id: -1
      });

      groups.push({
        category: "Ryhmät",
        label: "Tutorit",
        id: -1
      });

      groups.push({
        category: "Ryhmät",
        label: "Opiskelijat",
        id: -1
      });
      
//      RESTful.doGet(CONTEXTPATH + "/rest/user/searchUsers", {
//        parameters: {
//          'searchString': searchTerm
//        }
//      }).success(function (data, textStatus, jqXHR) {
//        for (var i = 0, l = data.length; i < l; i++) {
//          users.push({
//            label: data[i].fullName,
//            id: data[i].id
//          });
//        }
//      });

      return groups;
    },
    _doSearch: function (searchTerm) {
      var groups = this._searchGroups(searchTerm);
      var users = this._searchUsers(searchTerm);
      
      return $.merge(groups, users);
    },
    _selectRecipient: function (event, id, name) {
      var _this = this;
      var element = $(event.target);
      var recipientElement = element.hasClass("userSearchAutoCompleteUser") ? element : element.parents(".userSearchAutoCompleteUser");
      var recipientListElement = element.parents(".cm-newMessage").find(".cm-newMessage-recipientsList"); 
      
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
      if (!element.hasClass("cm-newMessage-recipient"))
        element = element.parents(".cm-newMessage-recipient");
      element.remove();
    },
    _showSettingsView: function () {
      var _this = this;
      this._clearContent();
      var templates = this._loadMessageTemplates();
      var signatures = this._loadMessageSignatures();
      
      var params = {
        templates: templates,
        signatures: signatures
      };
      
      renderDustTemplate('communicator/communicator_settings.dust', params, function (text) {
        _this._communicatorContent.append($.parseHTML(text));
        
//        _this._communicatorContent.find('.communicatorMessage').click($.proxy(_this._onMessageClick, _this));
        
//        $("select").change(function() {
//          var str = "";
//          $("select option:selected").each(function() {
//            str += $(this).text() + " ";
//          });
//          $("div").text(str);
//        });
        
        _this._communicatorContent.find('input[name="newTemplate"]').click(function (event) {
          _this._communicatorContent.find('input[name="templateId"]').val("NEW");
          _this._communicatorContent.find('input[name="templateName"]').val("");
          _this._communicatorContent.find('textarea[name="templateContent"]').val("");
        });
        _this._communicatorContent.find('input[name="newSignature"]').click(function (event) {
          _this._communicatorContent.find('input[name="signatureId"]').val("NEW");
          _this._communicatorContent.find('input[name="signatureName"]').val("");
          _this._communicatorContent.find('textarea[name="signatureContent"]').val("");
        });
        _this._communicatorContent.find('input[name="editTemplate"]').click(function (event) {
          var select = _this._communicatorContent.find('select[name="templateSelector"]');
          var val = select.find("option:selected").val();
          _this._communicatorContent.find('input[name="templateId"]').val(val);
          
          if (val) {
            RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/templates/{templateId}", {
              parameters: {
                'userId': _this._userId,
                templateId: val
              }
            }).success(function (data, textStatus, jqXHR) {
              var title = _this._communicatorContent.find('input[name="templateName"]');
              var content = _this._communicatorContent.find('textarea[name="templateContent"]');
              
              title.val(data.name);
              content.val(data.content);
            });
          }
        });
        _this._communicatorContent.find('input[name="editSignature"]').click(function (event) {
          var select = _this._communicatorContent.find('select[name="signatureSelector"]');
          var val = select.find("option:selected").val();
          _this._communicatorContent.find('input[name="signatureId"]').val(val);
          
          if (val) {
            RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/signatures/{signatureId}", {
              parameters: {
                'userId': _this._userId,
                signatureId: val
              }
            }).success(function (data, textStatus, jqXHR) {
              var title = _this._communicatorContent.find('input[name="signatureName"]');
              var content = _this._communicatorContent.find('textarea[name="signatureContent"]');
              
              title.val(data.name);
              content.val(data.signature);
            });
          }
        });
        _this._communicatorContent.find('input[name="deleteTemplate"]').click(function (event) {
          var select = _this._communicatorContent.find('select[name="templateSelector"]');
          var option = select.find("option:selected");
          var val = option.val();
          
          if (val) {
            RESTful.doDelete(CONTEXTPATH + "/rest/communicator/{userId}/templates/{templateId}", {
              parameters: {
                'userId': _this._userId,
                templateId: val
              }
            }).success(function (data, textStatus, jqXHR) {
              select.remove(option);
            });
          }
        });
        _this._communicatorContent.find('input[name="deleteSignature"]').click(function (event) {
          var select = _this._communicatorContent.find('select[name="signatureSelector"]');
          var option = select.find("option:selected");
          var val = option.val();
          
          if (val) {
            RESTful.doDelete(CONTEXTPATH + "/rest/communicator/{userId}/signatures/{signatureId}", {
              parameters: {
                'userId': _this._userId,
                signatureId: val
              }
            }).success(function (data, textStatus, jqXHR) {
              select.remove(option);
            });
          }
        });
        _this._communicatorContent.find('input[name="saveTemplate"]').click(function (event) {
          var select = _this._communicatorContent.find('select[name="templateSelector"]');
          var option = select.find("option:selected");
          var val = _this._communicatorContent.find('input[name="templateId"]').val();
          var name = _this._communicatorContent.find('input[name="templateName"]').val();
          var content = _this._communicatorContent.find('textarea[name="templateContent"]').val();
          if (val == "NEW") {
            RESTful.doPost(CONTEXTPATH + "/rest/communicator/{userId}/templates", {
              parameters: {
                'userId': _this._userId,
                name: name,
                content: content
              }
            }).success(function (data, textStatus, jqXHR) {
              var newOption = $("<option>");
              newOption.text(data.name);
              newOption.attr("value", data.id);
              select.append(newOption);

              _this._communicatorContent.find('input[name="templateId"]').val("NEW");
              _this._communicatorContent.find('input[name="templateName"]').val("");
              _this._communicatorContent.find('textarea[name="templateContent"]').val("");
            });
          } else {
            RESTful.doPost(CONTEXTPATH + "/rest/communicator/{userId}/templates/{templateId}", {
              parameters: {
                'userId': _this._userId,
                templateId: val,
                name: name,
                content: content
              }
            }).success(function (data, textStatus, jqXHR) {
              option.text(name);
            });
          }
        });
        _this._communicatorContent.find('input[name="saveSignature"]').click(function (event) {
          var select = _this._communicatorContent.find('select[name="signatureSelector"]');
          var option = select.find("option:selected");
          var val = _this._communicatorContent.find('input[name="signatureId"]').val();
          var name = _this._communicatorContent.find('input[name="signatureName"]').val();
          var content = _this._communicatorContent.find('textarea[name="signatureContent"]').val();

          if (val == "NEW") {
            RESTful.doPost(CONTEXTPATH + "/rest/communicator/{userId}/signatures", {
              parameters: {
                'userId': _this._userId,
                signatureId: val,
                name: name,
                signature: content
              }
            }).success(function (data, textStatus, jqXHR) {
              var newOption = $("<option>");
              newOption.text(data.name);
              newOption.attr("value", data.id);
              select.append(newOption);
              
              _this._communicatorContent.find('input[name="signatureId"]').val("NEW");
              _this._communicatorContent.find('input[name="signatureName"]').val("");
              _this._communicatorContent.find('textarea[name="signatureContent"]').val("");
            });
          } else {
            RESTful.doPost(CONTEXTPATH + "/rest/communicator/{userId}/signatures/{signatureId}", {
              parameters: {
                'userId': _this._userId,
                signatureId: val,
                name: name,
                signature: content
              }
            }).success(function (data, textStatus, jqXHR) {
              option.text(name);
            });
          }
        });
      });
    }
  });
  
  addWidgetController('communicator', CommunicatorWidgetController);

}).call(this);