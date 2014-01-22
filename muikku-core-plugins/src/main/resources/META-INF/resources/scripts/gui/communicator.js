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
    var imageUrl = CONTEXTPATH + "/themes/default/gfx/fish.jpg";
    if (item.image)
      imageUrl = item.image;
    
    var inner_html = 
      '<a><div class="communicator_autocomplete_item_container">' + 
      '<span class="communicator_autocomplete_item_image"><img width="25" height="25" src="' + imageUrl + '"></span>' +
      '<span class="communicator_autocomplete_item_label">' + item.label + '</span></div></a>';
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
      
      this._userPopup = widgetElement.find(".cm-userpopup-container");
      this._userId = widgetElement.find("input[name='userId']").val();
      this._communicatorContent = widgetElement.find(".cm-content");
      this._communicatorContent.on("click", ".cm-message", $.proxy(this._onMessageClick, this));
      
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
      
      this._communicatorContent.tooltip({
        items: ".mf-person",
        tooltipClass: "cm-userpopup-container",
        show: { delay: 500 },
        content: _this._getUserPopupContent
      });

      $(window).on("hashchange", function (event) {
        var hash = window.location.hash.substring(1);
        
        if (hash == "new") {
          _this._showNewMessageView();
        } else if (hash == "settings") {
          _this._showSettingsView();
        } else if (hash.startsWith("in/")) {
          var messageId = hash.substring(3);
          _this._showMessage(messageId);
        } else if (hash == "sent") {
          _this._showSentItems();
        } else if (hash.startsWith("sent/")) {
          var messageId = hash.substring(5);
          _this._showMessage(messageId);
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
        });
      });
    },
    _showSentItems: function () {
      var _this = this;
      this._clearContent();
      
      RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/sentitems", {
        parameters: {
          'userId': this._userId
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('communicator/communicator_sentitems.dust', data, function (text) {
          _this._communicatorContent.append($.parseHTML(text));
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
      var element = $(event.target);
      element = element.parents(".cm-message");
      var messageId = $(element).find("input[name='communicatorMessageIdId']").val();
      
      var box = "#in";
      
      if (window.location.hash) {
        if (window.location.hash.startsWith("#sent"))
          box = "#sent";
      }
      
      window.location.hash = box + "/" + messageId;
    },
    _showMessage: function(messageId) {
      var _this = this;
      this._clearContent();
      
      RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/messages/{messageId}", {
        parameters: {
          'userId': this._userId,
          'messageId': messageId
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('communicator/communicator_viewmessage.dust', data, function (text) {
          _this._communicatorContent.append($.parseHTML(text));
          
          _this._communicatorContent.find('.mf-backLink').click($.proxy(_this._onMessageBackClick, _this));
          _this._communicatorContent.find('.cm-message-replyLink').click($.proxy(_this._onReplyMessageClick, _this));
          _this._communicatorContent.find('.cm-message-replyAllLink').click($.proxy(_this._onReplyMessageClick, _this));
          _this._communicatorContent.find('.cm-message-trashMessageLink').click($.proxy(_this._onTrashMessageClick, _this));
        });
      });
    },
    _onMessageBackClick: function (event) {
      var box = "#in";
      
      if (window.location.hash) {
        if (window.location.hash.startsWith("#sent"))
          box = "#sent";
      }
      
      window.location.hash = box;
      return false;
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
            _this._selectRecipient(event, ui.item);
            $(this).val("");
            return false;
          }
        });

          
        _this._communicatorContent.find("input[name='tags']").bind("keydown", function(event) {
          // don't navigate away from the field on tab when selecting an item
          if (event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
            event.preventDefault();
          }
        }).autocomplete({
          source : function(request, response) {
            var term = _this._extractLast(request.term);
            response(_this._doSearchTags(term));
          },
          search : function() {
            // custom minLength
            var term = _this._extractLast(this.value);
            if (term.length < 2) {
              return false;
            }
          },
          focus : function() {
            // prevent value inserted on focus
            return false;
          },
          select : function(event, ui) {
            var terms = _this._split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(", ");
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
      var textarea = element.parents(".cm-newMessage").find("textarea[name='content']");
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
      var replyAll = element.hasClass("cm-message-replyAllLink");
      
      var element = $(event.target);
      element = element.parents(".cm-message-view");
      
      var newMessageElement = element.find(".cm-replyMessage");

      var communicatorMessageId = element.find("input[name='communicatorMessageId']").val();
      var communicatorMessageIdId = element.find("input[name='communicatorMessageIdId']").val();
      var recipients = [];
      var templates = this._loadMessageTemplates();
      var signatures = this._loadMessageSignatures();

      var subject = "";
      var content = "";
      var tags = "";
      
      RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/communicatormessages/{messageId}", {
        parameters: {
          'userId': this._userId,
          'messageId': communicatorMessageId
        }
      }).success(function (data, textStatus, jqXHR) {
        subject = data.caption;
        content = "\n\n\n" + data.content;
        
        if (data.tags_tq.length > 0) {
          tags = data.tags_tq[0].text;
          
          for (var tc = 1, tcl = data.tags_tq.length; tc < tcl; tc++) {
            tags = tags + ", " + data.tags_tq[tc].text;
          }
        }
        
        recipients.push({
          'id': data.sender_tq.id,
          'name': data.sender_tq.fullName
        });
      });

      if (replyAll) {
        RESTful.doGet(CONTEXTPATH + "/rest/communicator/{userId}/communicatormessages/{messageId}/recipients", {
          parameters: {
            'userId': this._userId,
            'messageId': communicatorMessageId
          }
        }).success(function (data, textStatus, jqXHR) {
          for (var i = 0, l = data.length; i < l; i++) {
            if (_this._userId != data[i].recipient) {
              recipients.push({
                'id': data[i].recipient,
                'name': data[i].recipient_tq.fullName
              });
            }
          }
        });
      }

      if (!newMessageElement.length) {
        var prms = {
          communicatorMessageId: communicatorMessageIdId,
          subject: subject,
          content: content,
          recipients: recipients,
          templates: templates,
          signatures: signatures,
          tags: tags
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
              _this._selectRecipient(event, ui.item);
              $(this).val("");
              return false;
            }
          });
  
          _this._communicatorContent.find("input[name='tags']").bind("keydown", function(event) {
            // don't navigate away from the field on tab when selecting an item
            if (event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
              event.preventDefault();
            }
          }).autocomplete({
            source : function(request, response) {
              var term = _this._extractLast(request.term);
              response(_this._doSearchTags(term));
            },
            search : function() {
              // custom minLength
              var term = _this._extractLast(this.value);
              if (term.length < 2) {
                return false;
              }
            },
            focus : function() {
              // prevent value inserted on focus
              return false;
            },
            select : function(event, ui) {
              var terms = _this._split(this.value);
              // remove the current input
              terms.pop();
              // add the selected item
              terms.push(ui.item.value);
              // add placeholder to get the comma-and-space at the end
              terms.push("");
              this.value = terms.join(", ");
              return false;
            }
          });
  
          _this._communicatorContent.find("select[name='templateSelector']").change($.proxy(_this._onSelectTemplate, _this));
          _this._communicatorContent.find("select[name='signatureSelector']").change($.proxy(_this._onSelectSignature, _this));
          _this._communicatorContent.find(".cm-newMessage-recipientsList").on("click", ".cm-newMessage-removeRecipient", $.proxy(_this._onRemoveRecipientClick, _this));
        });
      } else {
        
        var recipientListElement = newMessageElement.find(".cm-newMessage-recipientsList");

        recipientListElement.children(".cm-newMessage-recipient").remove();
        
        for (var i = 0; i < recipients.length; i++) {
//          var prms = {
//            id: recipients[i].id,
//            name: recipients[i].name
//          };
//  
          renderDustTemplate('communicator/communicator_messagerecipient.dust', recipients[i], function (text) {
            recipientListElement.append($.parseHTML(text));
          });
        }
      }
      
      return false;
    },
    _onTrashMessageClick: function (event) {
      var _this = this;
      var element = $(event.target);
      var replyAll = element.hasClass("cm-message-replyAllLink");
      
      element = element.parents(".cm-message-view-container");
      
      var communicatorMessageIdId = element.find("input[name='communicatorMessageIdId']").val();

      RESTful.doDelete(CONTEXTPATH + "/rest/communicator/{userId}/messages/{messageIdId}", {
        parameters: {
          'userId': this._userId,
          'messageIdId': communicatorMessageIdId
        }
      }).success(function (data, textStatus, jqXHR) {
        window.location.hash = "in";
      });
      
      return false;
    },
    _onCancelMessageClick: function (event) {
      var element = $(event.target);
      var newMessageElement = element.parents(".cm-newMessage");
      newMessageElement.remove();
      window.location.hash = "in";
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
      var recipientGroupIds = [];
      
      $(recipientListElement.children(".cm-newMessage-recipientuser")).each(function (index) {
        recipientIds.push($(this).find("input[name='userId']").val());
      });
      
      $(recipientListElement.children(".cm-newMessage-recipientgroup")).each(function (index) {
        recipientGroupIds.push($(this).find("input[name='groupId']").val());
      });
      
      RESTful.doPost(CONTEXTPATH + "/rest/communicator/{userId}/messages", {
        parameters: {
          'userId': this._userId,
          'subject': newMessageElement.find("input[name='subject']").val(),
          'content': newMessageElement.find("textarea[name='content']").val(),
          'recipients': recipientIds,
          'recipientGroups': recipientGroupIds,
          'tags': newMessageElement.find("input[name='tags']").val()
        }
      }).success(function (data, textStatus, jqXHR) {
        window.location.hash = "in";
      });
    },
    _onPostReplyMessageClick: function (event) {
      var _this = this;
      var element = $(event.target);
      var newMessageElement = element.parents(".cm-replyMessage");
      var recipientListElement = newMessageElement.find(".cm-newMessage-recipientsList");
      var recipientIds = [];
      var recipientGroupIds = [];
      
      $(recipientListElement.children(".cm-newMessage-recipientuser")).each(function (index) {
        recipientIds.push($(this).find("input[name='userId']").val());
      });
      
      $(recipientListElement.children(".cm-newMessage-recipientgroup")).each(function (index) {
        recipientGroupIds.push($(this).find("input[name='groupId']").val());
      });
      
      var messageId = newMessageElement.find("input[name='communicatorMessageId']").val();
      
      RESTful.doPost(CONTEXTPATH + "/rest/communicator/{userId}/messages/{messageId}", {
        parameters: {
          'userId': this._userId,
          'messageId': messageId,
          'subject': newMessageElement.find("input[name='subject']").val(),
          'content': newMessageElement.find("textarea[name='content']").val(),
          'recipients': recipientIds,
          'recipientGroups': recipientGroupIds,
          'tags': newMessageElement.find("input[name='tags']").val()
        }
      }).success(function (data, textStatus, jqXHR) {
        window.location.hash = "in";
      });
    },
    _doSearchTags: function (searchTerm) {
      var _this = this;
      var tags = new Array();

      RESTful.doGet(CONTEXTPATH + "/rest/tags/searchTags", {
        parameters: {
          'searchString': searchTerm
        }
      }).success(function (data, textStatus, jqXHR) {
        for (var i = 0, l = data.length; i < l; i++) {
          tags.push({
            label: data[i].text,
            id: data[i].id
          });
        }
      });

      return tags;
    },
    _searchUsers: function (searchTerm) {
      var _this = this;
      var users = new Array();

      RESTful.doGet(CONTEXTPATH + "/rest/users/searchUsers", {
        parameters: {
          'searchString': searchTerm
        }
      }).success(function (data, textStatus, jqXHR) {
        for (var i = 0, l = data.length; i < l; i++) {
          var img = undefined;
          
          if (data[i].hasPicture)
            img = CONTEXTPATH + "/picture?userId=" + data[i].id;
          
          users.push({
            category: getLocaleText("plugin.communicator.users"),
            label: data[i].fullName,
            id: data[i].id,
            image: img,
            type: "USER"
          });
        }
      });

      return users;
    },
    _searchGroups: function (searchTerm) {
      var _this = this;
      var userGroups = new Array();

      RESTful.doGet(CONTEXTPATH + "/rest/usergroup/searchGroups", {
        parameters: {
          'searchString': searchTerm
        }
      }).success(function (data, textStatus, jqXHR) {
        for (var i = 0, l = data.length; i < l; i++) {
          userGroups.push({
            category: getLocaleText("plugin.communicator.usergroups"),
            label: data[i].name,
            id: data[i].id,
            memberCount: data[i].memberCount,
            image: undefined, // TODO usergroup image
            type: "GROUP"
          });
        }
      });

      return userGroups;
    },
    _doSearch: function (searchTerm) {
      var groups = this._searchGroups(searchTerm);
      var users = this._searchUsers(searchTerm);
      
      return $.merge(groups, users);
    },
    _selectRecipient: function (event, item) {
      var _this = this;
      var element = $(event.target);
      var recipientListElement = element.parents(".cm-newMessage").find(".cm-newMessage-recipientsList"); 
      
      var prms = {
        id: item.id,
        name: item.label
      };
  
      if (item.type == "USER") {
        renderDustTemplate('communicator/communicator_messagerecipient.dust', prms, function (text) {
          recipientListElement.append($.parseHTML(text));
        });
      } else {
        if (item.type == "GROUP") {
          prms.memberCount = item.memberCount;
          
          renderDustTemplate('communicator/communicator_messagerecipientgroup.dust', prms, function (text) {
            recipientListElement.append($.parseHTML(text));
          });
        }
      }
        
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
              option.remove();
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
              option.remove();
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
    },
    _getUserPopupContent: function(callback) {
      var userId = $(this).find("input[name='mf-person-id']").val();
      
      if (userId > 0) {
        RESTful.doGet(CONTEXTPATH + "/rest/communicator/userinfo/{userId}", {
          parameters: {
            'userId': userId
          }
        }).success(function (data, textStatus, jqXHR) {
          renderDustTemplate('communicator/communicator_userpopup.dust', data, function (text) {
            callback($.parseHTML(text));
          });
        });
      }
    },
    _split: function(val) {
      return val.split(/,\s*/);
    },
    _extractLast: function(term) {
      return this._split(term).pop();
    }
  });
  
  addWidgetController('communicator', CommunicatorWidgetController);

}).call(this);