(function() {
  'use strict';
  
  
  
  var CommunicatorFolderController = function (options) {
    this.options = options;
  };
  
  
  
  $.extend(CommunicatorFolderController.prototype, {
    
    getToolset: function () {
      return {
        parameters: {
          delete: true,
          restore: false,
          label: true,
          markRead: true
        }
      }
    },
    
    loadItems: function (firstResult, maxResults, mainCallback) {
      throw Error("loadItems not implemented");
    },
    
    loadThread: function (threadId, firstResult, maxResults, callback) {
      throw Error("loadThread not implemented");
    },
    
    removeItems: function (ids, callback) {
      throw Error("removeItem not implemented");
    },

    restoreItems: function (ids, callback) {
      throw Error("restoreItems not implemented");
    },
    
    readThreadMessageCount: function (communicatorMessageId, callback) {
      throw Error("readThreadMessageCount not implemented");
    },
    
    markAsRead: function (threadId, callback) {
      callback();
    },
    
    markAsUnread: function (threadId, callback) {
      callback();
    },

    superApply: function (method) {
      CommunicatorFolder.prototype[method].call(this, Array.prototype.slice.call(arguments, 1));  
    }
    
  });
  
  var CommunicatorInboxFolderController = function (options) {
    this._super = CommunicatorFolderController.prototype;
    CommunicatorFolderController.call(this, arguments); 
  };
  
  $.extend(CommunicatorInboxFolderController.prototype, CommunicatorFolderController.prototype, {
    removeItems: function (ids, callback) {
      var calls = $.map(ids, function (id) {
        return function (callback) {
          mApi().communicator.items
            .del(id)
            .callback(callback);
        };
      })
      
      async.series(calls, callback);
    },
    
    loadItems: function (firstResult, maxResults, mainCallback) {
      var params = {
        firstResult: firstResult,
        maxResults: maxResults
      };
      
      mApi().communicator.items
        .read(params)
        .callback(mainCallback);
    },
    loadThread: function (threadId, firstResult, maxResults, callback) {
      var isStudent = $('.communicator').attr('data-student') == 'true';
      mApi().communicator.messages
        .read(threadId)
        .on("$.messages", $.proxy(function (message, messageCallback) {
          message.isOwner = MUIKKU_LOGGED_USER_ID === message.senderId;
          message.senderFullName = isStudent
            ? (message.sender.nickName ? message.sender.nickName : message.sender.firstName) + ' ' + message.sender.lastName
            : (message.sender.nickName ? message.sender.firstName + ' "' + message.sender.nickName + '"' : message.sender.firstName) + ' ' + message.sender.lastName
          message.senderHasPicture = message.sender.hasImage;
          message.caption = $('<div>').html(message.caption).text();
          
          messageCallback();
        }, this))
        .callback(callback);
    },
    readThreadMessageCount: function (communicatorMessageId, callback) {
      mApi().communicator.messages.messagecount
        .read(communicatorMessageId)
        .callback(callback);
    },
    markAsRead: function (threadId, callback) {
      mApi().communicator.items.markasread.create(threadId).callback(callback);    
    },
    markAsUnread: function (threadId, callback) {
      mApi().communicator.items.markasunread.create(threadId).callback(callback);    
    }
  });
  
  var CommunicatorUnreadFolderController = function (options) {
    this._super = CommunicatorFolderController.prototype;
    CommunicatorFolderController.call(this, arguments); 
  };
  
  $.extend(CommunicatorUnreadFolderController.prototype, CommunicatorFolderController.prototype, {
    removeItems: function (ids, callback) {
      var calls = $.map(ids, function (id) {
        return function (callback) {
          mApi().communicator.items
            .del(id)
            .callback(callback);
        };
      })
      
      async.series(calls, callback);
    },
    
    loadItems: function (firstResult, maxResults, mainCallback) {
      var params = {
        onlyUnread: true,
        firstResult: firstResult,
        maxResults: maxResults
      };
      
      mApi().communicator.items
        .read(params)
        .callback(mainCallback);
    },
    loadThread: function (threadId, firstResult, maxResults, callback) {
      var isStudent = $('.communicator').attr('data-student') == 'true';
      mApi().communicator.unread
        .read(threadId)
        .on("$.messages", $.proxy(function (message, messageCallback) {
          message.isOwner = MUIKKU_LOGGED_USER_ID === message.senderId;
          message.senderFullName = isStudent
            ? (message.sender.nickName ? message.sender.nickName : message.sender.firstName) + ' ' + message.sender.lastName
            : (message.sender.nickName ? message.sender.firstName + ' "' + message.sender.nickName + '"' : message.sender.firstName) + ' ' + message.sender.lastName
          message.senderHasPicture = message.sender.hasImage;
          message.caption = $('<div>').html(message.caption).text();
          
          messageCallback();
        }, this))
        .callback(callback);
    },
    readThreadMessageCount: function (communicatorMessageId, callback) {
      mApi().communicator.messages.messagecount
        .read(communicatorMessageId)
        .callback(callback);
    },
    markAsRead: function (threadId, callback) {
      mApi().communicator.items.markasread.create(threadId).callback(callback);    
    },
    markAsUnread: function (threadId, callback) {
      mApi().communicator.items.markasunread.create(threadId).callback(callback);    
    }
  });
  
  var CommunicatorLabelFolderController = function (labelId, options) {
    this._super = CommunicatorFolderController.prototype;
    this._labelId = labelId;
    CommunicatorFolderController.call(this, arguments); 
  };
  
  $.extend(CommunicatorLabelFolderController.prototype, CommunicatorFolderController.prototype, {
    removeItems: function (ids, callback) {
      var calls = $.map(ids, function (id) {
        return function (callback) {
          mApi().communicator.items
            .del(id)
            .callback(callback);
        };
      })
      
      async.series(calls, callback);
    },
    
    loadItems: function (firstResult, maxResults, mainCallback) {
      var params = {
        labelId: this._labelId,
        firstResult: firstResult,
        maxResults: maxResults
      };
      
      mApi().communicator.items
        .read(params)
        .callback(mainCallback);
    },
    loadThread: function (threadId, firstResult, maxResults, callback) {
      var isStudent = $('.communicator').attr('data-student') == 'true';
      mApi().communicator.userLabels.messages
        .read(this._labelId, threadId)
        .on("$.messages", $.proxy(function (message, messageCallback) {
          message.isOwner = MUIKKU_LOGGED_USER_ID === message.senderId;
          message.senderFullName = isStudent
            ? (message.sender.nickName ? message.sender.nickName : message.sender.firstName) + ' ' + message.sender.lastName
            : (message.sender.nickName ? message.sender.firstName + ' "' + message.sender.nickName + '"' : message.sender.firstName) + ' ' + message.sender.lastName
          message.senderHasPicture = message.sender.hasImage;
          message.caption = $('<div>').html(message.caption).text();
          
          messageCallback();
        }, this))
        .callback(callback);
    },
    readThreadMessageCount: function (communicatorMessageId, callback) {
      mApi().communicator.messages.messagecount
        .read(communicatorMessageId)
        .callback(callback);
    },
    markAsRead: function (threadId, callback) {
      mApi().communicator.items.markasread.create(threadId).callback(callback);    
    },
    markAsUnread: function (threadId, callback) {
      mApi().communicator.items.markasunread.create(threadId).callback(callback);    
    }
  });
  
  var CommunicatorSentFolderController = function (options) {
    this._super = CommunicatorFolderController.prototype;
    CommunicatorFolderController.call(this, arguments); 
  };
  
  $.extend(CommunicatorSentFolderController.prototype, CommunicatorFolderController.prototype, {

    removeItems: function (ids, callback) {
      var calls = $.map(ids, function (id) {
        return function (callback) {
          mApi().communicator.sentitems
            .del(id)
            .callback(callback);
        };
      })
      
      async.series(calls, callback);
    },
    
    loadItems: function (firstResult, maxResults, mainCallback) {
      mApi().communicator.sentitems
        .read({
          firstResult: firstResult,
          maxResults: maxResults
        })
        .callback(mainCallback);
    },

    loadThread: function (threadId, firstResult, maxResults, callback) {
      var isStudent = $('.communicator').attr('data-student') == 'true';
      mApi().communicator.sentitems
        .read(threadId)
        .on("$.messages", $.proxy(function (message, messageCallback) {
          message.isOwner = MUIKKU_LOGGED_USER_ID === message.senderId;
          message.senderFullName = isStudent
            ? (message.sender.nickName ? message.sender.nickName : message.sender.firstName) + ' ' + message.sender.lastName
            : (message.sender.nickName ? message.sender.firstName + ' "' + message.sender.nickName + '"' : message.sender.firstName) + ' ' + message.sender.lastName
          message.senderHasPicture = message.sender.hasImage;
          message.caption = $('<div>').html(message.caption).text();
          
          messageCallback();
        }, this))
        .callback(callback);
    },
    
    readThreadMessageCount: function (communicatorMessageId, callback) {
      mApi().communicator.messages.messagecount
        .read(communicatorMessageId)
        .callback(callback);
    },
    
    markAsRead: function (threadId, callback) {
      callback();
    },
    markAsUnread: function (threadId, callback) {
      callback();
    }
    
  });

  var CommunicatorTrashFolderController = function (options) {
    this._super = CommunicatorFolderController.prototype;
    CommunicatorFolderController.call(this, arguments); 
  };
  
  $.extend(CommunicatorTrashFolderController.prototype, CommunicatorFolderController.prototype, {

    getToolset: function () {
      var toolset = this._super.getToolset();
      toolset.parameters.restore = true;
      return toolset;
    },
    
    removeItems: function (ids, callback) {
      var calls = $.map(ids, function (id) {
        return function (callback) {
          mApi().communicator.trash
            .del(id)
            .callback(callback);
        };
      })
      
      async.series(calls, callback);
    },
    
    loadItems: function (firstResult, maxResults, mainCallback) {
      var params = {
        firstResult: firstResult,
        maxResults: maxResults
      };
      
      mApi().communicator.trash
        .read(params)
        .callback(mainCallback);
    },
  
    loadThread: function (threadId, firstResult, maxResults, callback) {
      var isStudent = $('.communicator').attr('data-student') == 'true';
      mApi().communicator.trash
        .read(threadId)
        .on("$.messages", $.proxy(function (message, messageCallback) {
          message.isOwner = MUIKKU_LOGGED_USER_ID === message.senderId;
          message.senderFullName = isStudent
            ? (message.sender.nickName ? message.sender.nickName : message.sender.firstName) + ' ' + message.sender.lastName
            : (message.sender.nickName ? message.sender.firstName + ' "' + message.sender.nickName + '"' : message.sender.firstName) + ' ' + message.sender.lastName
          message.senderHasPicture = message.sender.hasImage;
          message.caption = $('<div>').html(message.caption).text();
          
          messageCallback();
        }, this))
        .callback(callback);
    },
    
    readThreadMessageCount: function (communicatorMessageId, callback) {
      mApi().communicator.trash.messagecount
        .read(communicatorMessageId)
        .callback(callback);
    },
    
    restoreItems: function (ids, callback) {
      var calls = $.map(ids, function (id) {
        return function (callback) {
          mApi().communicator.trash.restore
            .update(id)
            .callback(callback);
        };
      })
      
      async.series(calls, callback);
    },
    markAsRead: function (threadId, callback) {
      mApi().communicator.trash.markasread.create(threadId).callback(callback);    
    },
    markAsUnread: function (threadId, callback) {
      mApi().communicator.trash.markasunread.create(threadId).callback(callback);    
    }
  });
  
  var CommunicatorSettingsController = function () {
   // not much to control, but maybe when there are more settings than signatures?
  };
  
  $.widget("custom.communicatorMessages", {
    _create : function() {
      this._firstItem = 0;
      this._items = [];
      this._folderId = this.options.folderId;
      $('.mf-controls-container').on('click', '.mf-label-link', $.proxy(this._onAddLabelToMessagesClick, this));
      $('.mf-controls-container').on('click', '.cm-delete-thread', $.proxy(this._onDeleteClick, this));
      $('.mf-controls-container').on('click', '.cm-restore-thread', $.proxy(this._onRestoreClick, this));
      $('.mf-controls-container').on('click', '.icon-message-unread', $.proxy(this._onMarkUnreadClick, this));
      $('.mf-controls-container').on('click', '.icon-message-read', $.proxy(this._onMarkReadClick, this));
      $('.mf-controls-container').on('click', '.cm-add-label-menu', $.proxy(this._onAddLabelMenuClick, this));         
      $('.mf-controls-container').on('click', '#newLabelSubmit', $.proxy(this._onCreateLabelClick, this));
      
      this.element.on('change', 'input[name="messageSelect"]', $.proxy(this._onThreadSelectionChange, this));
      this.element.on('click', '.cm-page-link-load-more:not(.disabled)', $.proxy(this._onMoreClick, this));
      this.element.on('click', '.cm-message-header-container', $.proxy(this._onMessageHeaderClick, this));
      $(document).on("Communicator:newmessagereceived", $.proxy(this._onNewMessageReceived, this));
      $(document).on('click', $.proxy(this._onDocumentClicked, this));
    },
    
    loadFolder: function (id) {
      this._folderId = id;
      this._reload($.proxy(function () {
        var folderController = this.element.closest('.communicator')
          .communicator('folderController', this._folderId);
        var toolset = folderController.getToolset();
        $('.mf-controls-container').messageTools('toolset', 'thread', toolset.parameters);
      }, this));
    },
    
    folderId: function () {
      return this._folderId;
    },
    
    _getSelectedThreads: function () {
      return $.map(this.element.find('input[name="messageSelect"]:checked'), function (input) {
        var message = $(input).closest('.cm-message');
        return {
          folderId: message.attr('data-folder-id'),
          id: message.attr('data-thread-id'),
          unread: message.hasClass("unread"),
          element: message
        };
      });
    },
    
    _loadMore: function (callback) {
      this._firstItem += this.options.maxMessageCount;
      this._load(callback);
    },
    
    _reload: function (callback) {
      this._firstItem = 0;
      this._items = [];
      this._load(callback);
    },
    
    _load: function (callback) {
      this.element
        .html('')
        .addClass('loading');
      
      var folderController = this.element.closest('.communicator') 
        .communicator('folderController', this._folderId);
      
      folderController.loadItems(this._firstItem, this.options.maxMessageCount + 1, $.proxy(function (err, items) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var communicator = $(".communicator").communicator("instance");
          var hasMore = false;
          
          $.each(items, function (ind, item) {
            if (item.labels) {
              for (var i = 0, l = item.labels.length; i < l; i++) {
                item.labels[i]["hexColor"] = communicator.colorIntToHex(item.labels[i].labelColor);
              }
            }
            
            if (item.recipients) {
              $.each(item.recipients, function (ind, recipient) {
                if (recipient.userId && recipient.userId == MUIKKU_LOGGED_USER_ID) {
                  recipient["self"] = true;
                }
              });
            }
          });
          
          if (items.length > this.options.maxMessageCount) {
            hasMore = true;
            items.pop();
          } 
          
          this._items = this._items.concat(items);
          var data = $.map(this._items, $.proxy(function (item) {
            return $.extend(item, {
              folderId: this._folderId
            });
          }, this));
          
          renderDustTemplate('communicator/communicator_items.dust', {
            items: data, sent: this._folderId == 'sent',
            isStudent: $('.communicator').attr('data-student') == 'true' ? 1 : ''
          }, $.proxy(function (text) {
            this.element
              .html(text)
              .removeClass('loading');
            
            if (hasMore) {
              this.element.find('.cm-page-link-load-more').removeClass('disabled');
            } else {
              this.element.find('.cm-page-link-load-more').addClass('disabled');
            }
            
            if (callback) {
              callback();
            }
          }, this));
        }
      }, this));
    },  
    _onNewMessageReceived: function () {
      if (this._folderId == "inbox") {
        this._reload();
      }
    },

    _onDocumentClicked: function (event) {
      var labelMenu = $(event.target).closest('.cm-label-menu');
      var labelButton = $(event.target).closest('.cm-add-label-container');
      
      if (labelMenu.length || labelButton.length) {
        return;
      } else {
        labelMenu = $('.mf-tool-container').find('.cm-label-menu');
        labelMenu.toggle(false);
      }
    },
    
    _onMoreClick: function (event) {
      this._loadMore($.proxy(function () {
        $('.cm-page-link-load-more')[0].scrollIntoView();
      }, this));
    },
    
    _onDeleteClick: function (event) {
      if ($(event.target).closest(".mf-tool-container").hasClass("disabled"))
        return;
      
      var selectedThreads = this._getSelectedThreads();
      this.element.closest('.communicator') 
        .communicator('deleteThreads', selectedThreads);
    },
    
    _onRestoreClick: function (event) {
      if ($(event.target).closest(".mf-tool-container").hasClass("disabled"))
        return;
      
      var selectedThreads = this._getSelectedThreads();
      this.element.closest('.communicator') 
        .communicator('restoreThreads', selectedThreads);
    },
    
    _onMarkUnreadClick: function (event) {
      if ($(event.target).closest(".mf-tool-container").hasClass("disabled"))
        return;
      
      var selectedThreads = this._getSelectedThreads();
      this.element.closest('.communicator') 
        .communicator('markUnreadThreads', selectedThreads, $.proxy(function () {
          $.each(selectedThreads, function (idx, thread) {
            thread.element.addClass("unread");
          });
          $('.cm-messages-container').communicatorMessages('updateThreadSelection');
        }, this));
    },
    
    _onMarkReadClick: function (event) {
      if ($(event.target).closest(".mf-tool-container").hasClass("disabled"))
        return;
      
      var selectedThreads = this._getSelectedThreads();
      this.element.closest('.communicator') 
        .communicator('markReadThreads', selectedThreads, $.proxy(function () {
          $.each(selectedThreads, function (idx, thread) {
            thread.element.removeClass("unread");
          });
          
          $('.cm-messages-container').communicatorMessages('updateThreadSelection');
        }, this));
    },

    _onMessageHeaderClick: function (event) {
      var threadId = $(event.target).closest('.cm-message')
        .attr('data-thread-id');
      
      this.element.closest('.communicator') 
        .communicator('loadThread', threadId);
    },

    _onThreadSelectionChange: function (event) {
      this.updateThreadSelection();
    },
    
    updateThreadSelection: function () {
      var selectedThreads = this._getSelectedThreads();
      var communicatorElement = this.element.closest(".communicator");
      var hasUnread = false;
      var markMessages = communicatorElement.find(".cm-mark-thread");
      
      for(var i = 0; i < selectedThreads.length; i++) {
        if (selectedThreads[i].unread == true) {
          hasUnread = true;          
        }        
      }
      
      if (selectedThreads.length === 0) {
        communicatorElement.find(".cm-delete-thread").closest(".mf-tool-container").addClass("disabled");
        communicatorElement.find(".cm-restore-thread").closest(".mf-tool-container").addClass("disabled");
        markMessages.closest(".mf-tool-container").addClass("disabled");
        markMessages.attr("title", getLocaleText("plugin.communicator.tool.title.unread"));
        markMessages.removeClass("icon-message-read");
        markMessages.addClass("icon-message-unread"); 
      } else {
        communicatorElement.find(".cm-delete-thread").closest(".mf-tool-container").removeClass("disabled");
        communicatorElement.find(".cm-restore-thread").closest(".mf-tool-container").removeClass("disabled");
        communicatorElement.find(".cm-mark-thread").closest(".mf-tool-container").removeClass("disabled");
        
        if(hasUnread == true) {
          markMessages.attr("title", getLocaleText("plugin.communicator.tool.title.read"));
          markMessages.removeClass("icon-message-unread");
          markMessages.addClass("icon-message-read");
        } else {
          markMessages.attr("title", getLocaleText("plugin.communicator.tool.title.unread"));          
          markMessages.removeClass("icon-message-read");
          markMessages.addClass("icon-message-unread");          
        }
      }
    },
    
    _onAddLabelMenuClick: function (event) {
      var labelObjs = $('.cm-categories').find('.mf-label');      
      var labels = [];
      var messagesLabels = [];
      var labelOccurrances = {};
      var checkedMessages = $('.cm-messages-pages').find('input[name="messageSelect"]:checked');
      var checkedMessagesLabels = checkedMessages.closest('.cm-message-header').find('.mf-item-label');

      $.each(checkedMessagesLabels, function(key, label) {
        var labelId = $(label).attr('data-label-id')
        if( messagesLabels.indexOf(labelId) == -1){
          messagesLabels.push(labelId);
          labelOccurrances[labelId] = 1; 
        }else{  
          labelOccurrances[labelId]++;
        }
      });
      
      $.each(labelObjs, function(key, value){
        var label = {};
        var lName = $(value).attr('data-folder-name');
        var lStyle = $(value).find('.cm-label-name').attr('style');
        var lId = $(value).attr('data-label-id');
        var lSelected = messagesLabels.indexOf(lId) == -1 ? false : true; 
        var lAllSelected =  labelOccurrances[lId] == checkedMessages.length ? true : false;
        labels.push({name: lName, id: lId, selected: lSelected, inAll: lAllSelected, style: lStyle });
        
      });

      renderDustTemplate('communicator/communicator_label_link.dust', labels, $.proxy(function (text) {
        $(".mf-tool-label-container").html(text);
        
        $('#communicatorNewlabelField').on('input', $.proxy(this._onLabelFilterInputChange, this));
      }, this));
      
      $(event.target).closest('.mf-tool-container').find('.cm-label-menu').toggle();
    },
    
    _onLabelFilterInputChange: function (event) {
      if (this._typingTimer) {
        clearTimeout(this._typingTimer);
      }
      
      this._typingTimer = setTimeout($.proxy(function() {
        this._onLabelFilterInputChangeTimeout(event);
      }, this), 500);
    },
    
    _onLabelFilterInputChangeTimeout: function (event) {
      var filter = $(event.target).val().toLowerCase();
      $('.mf-label-link').show();
    
      if (filter) {
        $('.mf-label-link span').each(function (idx, element) {
          var spanner = $(element);
          if (spanner.text().toLowerCase().indexOf(filter) == -1) {
            spanner.closest('.mf-label-link').hide();
          }
        });
      }
    },

    _onAddLabelToMessagesClick: function (event) {  
      var clickedLabel = $(event.target).closest('.mf-label-link');
      var lId = $(clickedLabel).attr('data-label-id');
      var isSelectedInAll = $(event.target).closest('.mf-label-link').hasClass('selected-in-all') ? true : false;
      var addLabelChanges = [];
      var removeLabelChanges = [];
      var checkedMessageThreads = $('.cm-messages-pages').find('input[name="messageSelect"]:checked');
       
      $.each(checkedMessageThreads, function(key, value) {
        var inputElement = $(value);
        var labelElement = inputElement.closest('.cm-message').find('.cm-message-label[data-label-id=' + lId + ']');

        var messageId = inputElement.attr('value');
        var messageLabelId = labelElement.attr('data-message-label-id');        
        
        if (labelElement.length) {
          if(isSelectedInAll == true){
            mApi().communicator.messages.labels.del(messageId, messageLabelId).callback($.proxy(function (err, results) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.communicator.label.create.error.remove"));
              } else {
                var communicator = $(".communicator").communicator("instance");
                var messageThreadElement = $('.cm-message[data-thread-id="' + messageId + '"]');
                var labelElement = messageThreadElement.find('.cm-message-label[data-label-id=' + lId + ']');
                              
                labelElement.remove();
              }
            }, this));
          }
        } else {
          mApi().communicator.messages.labels.create(messageId, { labelId: lId }).callback($.proxy(function (err, label) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.communicator.label.create.error.add"));
            } else {
              var communicator = $(".communicator").communicator("instance");
              var messageThreadElement = $('.cm-message[data-thread-id="' + label.messageThreadId + '"]');
              
              label["hexColor"] = communicator.colorIntToHex(label.labelColor);
              
              renderDustTemplate('communicator/communicator_item_label.dust', label, $.proxy(function (text) {
                messageThreadElement.find('.cm-message-header-content-secondary').append($(text));
              }, this));
            }
          }, this));
        }
      });
      
      if(isSelectedInAll === true){
        $(clickedLabel).removeClass('selected-in-all');
      }else{
        $(clickedLabel).removeClass('selected').addClass('selected-in-all');    
      }

      
    },
    
    _onCreateLabelClick: function (event) {
      var labelObjs = $('.cm-categories').find('.mf-label');      
      
      var labels = [];
      
      $.each(labelObjs, function(key, value){
        var name= $(value).attr('data-folder-name');
        labels.push(name);
      });      
      var communicator = $('.communicator').communicator("instance");
      var name =  $('#communicatorNewlabelField').val();
      var color = Math.round(Math.random() * 16777215);
      var hexColor = communicator.colorIntToHex(color);
      if (name != '') {
        if (labels.indexOf(name) == -1) {
          communicator.createLabel(name, hexColor);
        } else {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.communicator.label.create.error.alreadyexists"));
        }
      } else {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.communicator.label.create.error.empty"));
      }
    }    
    
  });
  
  $.widget("custom.messageTools", {
    options : {
      value : 'none'
    },
    _create : function(){
      this.toolset(this.options.value);
    },
    toolset: function(value, parameters) {   
      var toolTemplate = null;
      if ( value === undefined ) {
        return this.options.value;
      }      
      this.options.value = value;
      switch (this.options.value) {
        case 'message':
          toolTemplate = 'communicator/communicator_tools_message.dust';
          this._loadTools(toolTemplate, parameters);
          break;
        case 'thread':
          toolTemplate = 'communicator/communicator_tools_thread.dust';
          this._loadTools(toolTemplate, parameters);
          break;
        case 'settings':
          toolTemplate = 'communicator/communicator_tools_settings.dust';
          this._loadTools(toolTemplate, parameters);
          break;          
      }      
    },
    
    _loadTools: function(toolSet, parameters) {
      renderDustTemplate(toolSet, { toolset: parameters }, $.proxy(function (text) {
        this.element.html(text);
      }, this));
    }
  }); 
  

  $.widget("custom.communicator", {
    options: {
      defaultFolderId: 'inbox'
    },
    _create : function() {
      
    $('.mf-view-settings-function-container').on('click', '.cm-settings-icon', $.proxy(this._onSettingsClick, this));    

      
   
      this.loadLabels($.proxy(
        function (err, labels) {
          this._folderControllers = {
            'inbox': new CommunicatorInboxFolderController(),
            'unread': new CommunicatorUnreadFolderController(),
            'sent': new CommunicatorSentFolderController(),
            'trash': new CommunicatorTrashFolderController(),
            'settings': new CommunicatorSettingsController(),
          };
          
          if (err) {
          } else {
            var addLabelControlsCalls = $.map(labels, $.proxy(function(label) {
              return $.proxy(function(callback) {
                this.addLabelControl(label, callback);
              }, this)
            }, this));
  
            async.series(addLabelControlsCalls, $.proxy(function() {
              this._sortLabels();
            }, this));
          }
          
          var folderId;
          var threadId;
           
          if (window.location.hash.length > 1) {
            var hashParts = window.location.hash.substring(1).split('/');
            if (hashParts.length > 0) {
              folderId = hashParts[0];
            }

            if (hashParts.length > 1) {
              threadId = hashParts[1];
            }
          }

          folderId = this._folderControllers[folderId] ? folderId : this.options.defaultFolderId;
          
          this.element.on('click', '.mf-label-edit', $.proxy(this._onLabelEditClick, this));    
                 
          this.element.find('.cm-messages-container').communicatorMessages({
            maxMessageCount: this.options.maxMessageCount,
            folderId: folderId
          });
          $('.mf-controls-container').messageTools();
          this.element.on('click', '.mf-label-functions', $.proxy(this._onLabelMenuOpenClick, this));    
          this.element.on('click', '.mf-label-function-edit', $.proxy(this._onLabelEditClick, this));  
          this.element.on('click', '.mf-label-function-delete', $.proxy(this._onLabelDeleteClick, this));               
          this.element.find('.cm-thread-container').communicatorThread();       
          this.element.on('click', '.cm-setting-create-signature-link', $.proxy(this._onNewSignatureLinkClick, this));
          this.element.on('click', '.cm-setting-edit-signature-link', $.proxy(this._onEditSignatureLinkClick, this));          
          this.element.on('click', '.cm-setting-remove-signature-link', $.proxy(this._removeSignature, this));
          this.element.on('click', '.cm-new-message-button', $.proxy(this._onNewMessageButtonClick, this));
          
          this.element.on('click', '.cm-folder', $.proxy(this._onCommunicatorFolderClick, this));
          
          if (threadId) {
            this.loadThread(threadId);  
          } else {
            this.loadFolder(folderId);       
          }
        }
      , this));
      
    },
    _onSettingsClick: function() { 
      this.loadSignatures($.proxy(function(err, signatures) {        
        if(err){
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.signatures.loading'));          
        }else{          
          renderDustTemplate('communicator/communicator_settings.dust', {signatures : signatures}, $.proxy(function(text) {
            $(".cm-thread-container").hide();
            $(".cm-messages-container").html(text).show();
            $('.mf-controls-container').messageTools( 'toolset', 'settings');   
            this._updateHash('settings', null);
          }, this));
        }
      }, this)); 
    },

    loadFolder: function (id) {
      
      if(id == 'settings'){
        this._onSettingsClick();
        this._updateHash(id, null);        
      }else{
      
        this._updateHash(id, null);
        this._updateSelected(id);
        
        this.element.find('.cm-thread-container').hide();
        this.element.find('.cm-messages-container')
          .communicatorMessages('loadFolder', id)
          .show();
      }
    },
    
    reloadFolder: function () {
      var folderId = this.element.find('.cm-messages-container')
        .communicatorMessages('folderId');
    
      this.loadFolder(folderId);
    },
    
    loadThread: function (threadId) {
      var folderId = this.element.find('.cm-messages-container')
        .communicatorMessages('folderId');
      var folderController = this.element.closest('.communicator')
        .communicator('folderController', folderId);
      
      this._updateHash(folderId, threadId);
      this._updateSelected(folderId);
      
      this.element.find('.cm-messages-container').hide();
      
      var toolset = folderController.getToolset();
      $('.mf-controls-container').messageTools('toolset', 'message', toolset.parameters);     
      this.element.find('.cm-thread-container')
        .empty()
        .communicatorThread('loadThread', folderId, threadId)
        .show();
    },
    
    deleteThread: function (folderId, threadId) {
      this.deleteThreads([{
        folderId: folderId,
        id: threadId
      }]);
    },
    
    deleteThreads: function (threads) {
      this._removeThreads(threads, $.proxy(function () {
        this.reloadFolder();
        $(document).trigger("Communicator:threaddeleted");
      }, this));
    },
    
    restoreThread: function (folderId, threadId) {
      this.restoreThreads([{
        folderId: folderId,
        id: threadId
      }]);
    },
    
    restoreThreads: function (threads) {
      this._restoreThreads(threads, $.proxy(function () {
        this.reloadFolder();
        $(document).trigger("Communicator:threadrestored");
      }, this));
    },

    markUnreadThreads: function (threads, successCallback) {
      var calls = $.map(threads, $.proxy(function (thread) {
        return $.proxy(function (callback) {
          this._folderControllers[thread.folderId].markAsUnread(thread.id, callback);
        }, this);
      }, this));
      
      async.series(calls, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          mApi().communicator.cacheClear();
          $(document).trigger("Communicator:messageread");
          if (successCallback) {
            successCallback();
          }
        }
      }, this));
    },

    markReadThreads: function (threads, successCallback) {
      var calls = $.map(threads, $.proxy(function (thread) {
        return $.proxy(function (callback) {
          this._folderControllers[thread.folderId].markAsRead(thread.id, callback);
        }, this);
      }, this));
      
      async.series(calls, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          mApi().communicator.cacheClear();
          $(document).trigger("Communicator:messageread");
          if (successCallback) {
            successCallback();
          }
        }
      }, this));
    },    
    
    createLabel: function (name, hexColor) {
      var colorInt = this.hexToColorInt(hexColor);
      var label = {
        name: name,
        color: colorInt
      };
      
      mApi().communicator.userLabels.create(label).callback($.proxy(function (err, label) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          this.addLabelControl(label, $.proxy(function() {
            this._sortLabels();
          }, this));
        }
      }, this));
    },
    
    updateLabel: function (id, name, hexColor) {
      var colorInt = this.hexToColorInt(hexColor);
      var label = {
        id: id,
        name: name,
        color: colorInt
      };
      
      mApi().communicator.userLabels.update(id, label).callback($.proxy(function (err, label) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var newColor = this.colorIntToHex(label.color);
          this.element.find('.cm-categories').find('.mf-label[data-label-id="' + label.id + '"] span').text(label.name);
          this.element.find('.cm-categories').find('.mf-label[data-label-id="' + label.id + '"] .mf-label-name').css({ color: newColor});
          this._sortLabels();
        }
      }, this));
    },

    deleteLabel: function (id) {
      mApi().communicator.userLabels.del(id).callback($.proxy(function (err, label) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          this.element.find('.cm-categories').find('.mf-label[data-label-id="' + id + '"]').remove();
        }
      }, this));
    },
    
    loadLabels: function (callback) {
      mApi().communicator.userLabels.read().callback($.proxy(function (err, results) {
        callback(err, results);
      }, this));
    },
    
    _sortLabels: function () {
      var labelContainer = this.element.find('.cm-categories ul');
      var labelItems = labelContainer.children('.mf-label');

      labelItems.sort(function(a, b) {
        return $(a).find("span").text().toUpperCase().localeCompare($(b).find("span").text().toUpperCase());
      });

      $.each(labelItems, function(idx, itm) {
        labelContainer.append(itm);
      });
    },

    loadSignatures: function (callback) {
      mApi().communicator.signatures.read().callback($.proxy(function (err, results) {
        callback(err, results);
      }, this));
    },
    
    createSignature: function (name, signature, callback) {
      mApi().communicator.signatures.create({ name: name, signature: signature }).callback($.proxy(function (err, results) {
        callback(err, results);
      }, this));
    },

    updateSignature: function (id, name, signature, callback) {
      mApi().communicator.signatures.update(id, { id : id, name: name, signature: signature }).callback($.proxy(function (err, results) {
        callback(err, results);
      }, this));
    },

    deleteSignature: function (id, callback) {
      mApi().communicator.signatures.del(id).callback($.proxy(function (err, results) {
        callback(err, results);
      }, this));
    },
    
    _removeSignature: function  (event) {
      var id = $(event.target).closest('.cm-signature').attr('data-id');
      this._confirmSignatureRemoval(id, $.proxy(function (){
        this.deleteSignature(id, $.proxy(function () {
          this._onSettingsClick();
        }, this));
      }, this));
      
    }, 
    
    _confirmSignatureRemoval: function (id, confirmCallback) {
      renderDustTemplate('communicator/communicator_confirm_signature_removal.dust', {}, $.proxy(function(text) {
        var dialog = $(text);
        $(text).dialog({
          modal : true,
          resizable : false,
          width : 360,
          dialogClass : "cm-signature-management-dialog",
          buttons : [ {
            'text' : dialog.attr('data-button-confirm-text'),
            'class' : 'delete-button',
            'click' : function(event) {
              $(this).dialog().remove();
              confirmCallback();
            }
          }, {
            'text' : dialog.attr('data-button-cancel-text'),
            'class' : 'cancel-button',
            'click' : function(event) {
              $(this).dialog().remove();
            }
          } ]
        });
      }, this));
    },    
    _onLabelMenuOpenClick : function(event){
      var menus = $(event.target).closest("ul").find('.mf-label-functions-menu');
      var clickedMenu = $(event.target).closest("li").find('.mf-label-functions-menu');
      var menuPosition = $(event.target).closest("li").width() - 10;
      var menuState = clickedMenu.css('display') ;     
      clickedMenu.css('left', menuPosition);
      
      menus.hide();

      if(menuState == 'none'){
        clickedMenu.show();       
      }else{
        clickedMenu.hide();   
        
      }
    }, 
    
    _onLabelEditClick : function(event) {
      var communicator = $('.communicator').communicator("instance");
      var folderId = $(event.target).closest("li").attr("data-folder-id");
      var menus = $(event.target).closest("ul").find('.mf-label-functions-menu');      
      var folderController = this._folderControllers[folderId];
      var labelId = folderController._labelId;
  
      mApi().communicator.userLabels.read(labelId).callback($.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var label = results;
          label.hexColor =  communicator.colorIntToHex(label.color);
          renderDustTemplate('communicator/communicator_label_edit.dust', label, $.proxy(function(text) {
            this._dialog = $(text);      
            $(this._dialog).dialog(
              {
                'title' : getLocaleText("plugin.communicator.label.edit.caption"),              
                buttons : [ {
  
                   'text' :  getLocaleText("plugin.communicator.label.edit.button.send"),
                   'class' : 'save-button',
                   'click' : function() {
                       
                       var id = $(this).find("input[type='text']").attr('data-id');
                       var name = $(this).find("input[type='text']").val();
                       var color = $(this).find("input[type='color']").val();
                       var communicator = $(".communicator").communicator("instance");            
                       communicator.updateLabel(id, name, color);
                       $(this).dialog().remove();
                       menus.hide();
                       
                    // TODO: REFRESH LABELS
                   }
                
                 }, 
               
                 {
                   'text' :  getLocaleText("plugin.communicator.label.edit.button.cancel"),
                   'class' : 'cancel-button',
                   'click' : function(){               
                     $(this).dialog().remove();
                     menus.hide();
                 }
               }
               ]
              } 
            );
          }));
        }
      }, this));
 
    },
    _onLabelDeleteClick : function(event){
      var folderId = $(event.target).closest("li").attr("data-folder-id");
      var folderName = $(event.target).closest("li").attr("data-folder-name");
      var menus = $(event.target).closest("ul").find('.mf-label-functions-menu');      
      var folderController = this._folderControllers[folderId];
      var labelId = folderController._labelId;      
      var label = [];
      
      label.id = labelId;
      label.name = folderName;
      
      renderDustTemplate('communicator/communicator_label_delete.dust', label, $.proxy(function(text) {
        this._dialog = $(text);      
        $(this._dialog).dialog(
            
          {
            'title' : getLocaleText("plugin.communicator.label.remove.caption"),                          
            buttons : [ {
               'text' : getLocaleText("plugin.communicator.label.remove.button.send"),
               'class' : 'save-button',
               'click' :  function() {
                 
                 var id = $(this).find("div").attr('data-id');
                 var communicator = $(".communicator").communicator("instance");
                 communicator.deleteLabel(id);
                 $(this).dialog('close');
                 menus.hide();
              // TODO: REFRESH LABELS
             }
             }, 
           
             {
               'text' : getLocaleText("plugin.communicator.label.edit.button.cancel"),
               'class' : 'cancel-button',
               'click' : function(){               
                 $(this).dialog('close');
               
             }
           }           
           ]
          } 
        );
      
      }));      
    },
    addLabelControl: function (label, callback) {
      this._folderControllers[ "label-" + label.id ] = new CommunicatorLabelFolderController(label.id);
      
      // Label has id, name, color
      
      label.hexColor = this.colorIntToHex(label.color);

      renderDustTemplate('communicator/communicator_label.dust', label, $.proxy(function (text) {
        this.element.find(".cm-categories ul").append(text);
        
        if (callback) {
          callback();
        }
      }, this));
      
    },
    
    colorIntToHex: function (color) {
      var b = (color & 255).toString(16);
      var g = ((color >> 8) & 255).toString(16);
      var r = ((color >> 16) & 255).toString(16);

      var rStr = r.length == 1 ? "0" + r : r;
      var gStr = g.length == 1 ? "0" + g : g;
      var bStr = b.length == 1 ? "0" + b : b;
      
      return "#" + rStr + gStr + bStr;
    },
    
    hexToColorInt: function (hexColor) {
      var r = 255;
      var g = 255;
      var b = 255;
    
      if (hexColor) {
        if (hexColor.length == 7)
          hexColor = hexColor.slice(1);
        
        r = parseInt(hexColor.slice(0, 2), 16);
        g = parseInt(hexColor.slice(2, 4), 16);
        b = parseInt(hexColor.slice(4, 6), 16);
      }
        
      return (r << 16) + (g << 8) + b;
    },
    
    folderController: function (folderId) {
      return this._folderControllers[folderId];
    },
        
    newMessageDialog: function (options) {
      var dialog = $('<div>')
        .communicatorCreateMessageDialog($.extend(options||{}, {
          groupMessagingPermission: this.options.groupMessagingPermission,
          isStudent: this.options.isStudent
        }));
      
      dialog.on('dialogReady', function(e) {
        $(document.body).css({
          paddingBottom: dialog.height() + 50 + 'px'
        }).addClass('footerDialogOpen');
      });
      
      dialog.on('dialogClose', function(e) {
        $(document.body).removeClass('footerDialogOpen').removeAttr('style');
      });
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
    
    signatureDialog: function (options) {
      var dialog = $('<div>')
        .communicatorCreateEditSignatureDialog(options);
      
      dialog.on('dialogReady', function(e) {
        $(document.body).css({
          paddingBottom: dialog.height() + 50 + 'px'
        }).addClass('footerDialogOpen');
      });
      
      dialog.on('dialogClose', function(e) {
        $(document.body).removeClass('footerDialogOpen').removeAttr('style');
      });
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },


    
    _updateHash: function (folderId, threadId) {
      if (folderId) {
        if (threadId) {
          window.location.hash = '#' + folderId + '/' + threadId;
        } else {
          window.location.hash = '#' + folderId;
        }
      } else {
        window.location.hash = '';
      }
    },
    
    _updateSelected: function (id) {
      this.element.find('.cm-folder')
        .removeClass('selected');
      this.element.find('.cm-folder[data-folder-id="' + id + '"]')
        .addClass('selected');
    },
    
    _removeThreads: function (threads, mainCallback) {
      var folderMap = {};
      
      $.each(threads, function (index, thread) {
        if (!folderMap[thread.folderId]) {
          folderMap[thread.folderId] = [];
        }
        
        folderMap[thread.folderId].push(thread.id);
      });
      
      var calls = $.map(folderMap, $.proxy(function (ids, folderId) {
        return $.proxy(function (callback) {
          this._folderControllers[folderId].removeItems(ids, callback);
        }, this);
      }, this));
      
      async.series(calls, mainCallback);
    },
    
    _restoreThreads: function (threads, mainCallback) {
      var folderMap = {};
      
      $.each(threads, function (index, thread) {
        if (!folderMap[thread.folderId]) {
          folderMap[thread.folderId] = [];
        }
        
        folderMap[thread.folderId].push(thread.id);
      });
      
      var calls = $.map(folderMap, $.proxy(function (ids, folderId) {
        return $.proxy(function (callback) {
          this._folderControllers[folderId].restoreItems(ids, callback);
        }, this);
      }, this));
      
      async.series(calls, mainCallback);
    },
    
    _onNewMessageButtonClick: function (event) {
      this.newMessageDialog();
    },
    
    _onEditSignatureLinkClick: function (event) {
      var signatureElem = $(event.target).closest('.cm-signature');
      var signature = {};
      
      signature.id = signatureElem.attr('data-id');
      signature.name = signatureElem.attr('data-name');
      signature.content = signatureElem.attr('data-signature');
      
      this.signatureDialog({signature: signature});
    },    
    
    _onNewSignatureLinkClick: function (event) {
      this.signatureDialog();
    },
    
    
    _onCommunicatorFolderClick: function (event) {
      var folderId = $(event.target).closest('.cm-folder')
        .attr('data-folder-id');
      
      this.loadFolder(folderId);
    }
    
  });
  
  $.widget("custom.communicatorCreateEditSignatureDialog", {
    
    options: {
      signature: null,
      ckeditor: {
        toolbar: [
          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
          { name: 'links', items: [ 'Link' ] },
          { name: 'insert', items: [ 'Image', 'Smiley', 'SpecialChar' ] },
          { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
          { name: 'styles', items: [ 'Format' ] },
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
          { name: 'tools', items: [ 'Maximize' ] }
        ],
      }
    },
      
    _create : function() {
      
      this._load($.proxy(function () {
        this._contentsEditor = CKEDITOR.replace(this.element.find('textarea[name="content"]')[0], $.extend(this.options.ckeditor, {
          on: {
            instanceReady: $.proxy(this._onCKEditorReady, this)
          }
        }));

        if(this.options.signature){
          this._contentsEditor.setData(this.options.signature.content);          
        }                
        
      }, this));
        
      this.element.on('click', 'input[name="send"]', $.proxy(this._onSendClick, this));
      this.element.on('click', 'input[name="cancel"]', $.proxy(this._onCancelClick, this));
    },
    
    _load: function (callback) {
      var content = null;

      renderDustTemplate('communicator/communicator_create_signature.dust', {content : content}, $.proxy(function (text) {
        this.element.html(text);
        if(callback){
          callback();
        }
      }, this));
      
    },    
    _destroy: function () {
      try {
        this._contentsEditor.destroy();
      } catch (e) {
        alert(e);
      }
    },
    
    _onSendClick: function (event) {
      this.element.addClass('loading');
      var communicator = $(".communicator").communicator("instance");

      
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        var buttonElement = $(event.target);
        buttonElement.attr('disabled','disabled');
        
        var content = this._contentsEditor.getData();

        if (!content  ||  !content.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.validation.nocontent'));
          buttonElement.removeAttr('disabled');
          return false;
        }
        
        if (this.options.signature) {
          communicator.updateSignature(this.options.signature.id, this.options.signature.name, content, $.proxy(function () {
            this.element.removeClass('loading');
            communicator._onSettingsClick();
            this._closeDialog(event);
          }, this));
        } else {
          var caption = 'default';
          communicator.createSignature(caption, content, $.proxy(function () {
            communicator._onSettingsClick();
            this._closeDialog(event);
          }, this));                    
        }
      }      
    },

    _closeDialog: function (event) {
      event.preventDefault();
      this.element.trigger('dialogClose');
      this.element.remove();
    },
    
    _onCancelClick: function (event) {
      this._closeDialog(event);
    },
    
    _onCKEditorReady: function (e) {
      this.element.find('input[name="send"]').removeAttr('disabled');
      this.element.trigger('dialogReady');
    }
  });  
  
  $.widget("custom.communicatorThread", {
    _create : function() {
      var controls = $('.mf-controls-container');
      this._threadId = null;
      controls.on('click', '.icon-goback', $.proxy(this._onBackClick, this));
      controls.on('click', '.cm-delete-message', $.proxy(this._onDeleteClick, this));
      controls.on('click', '.cm-restore-message', $.proxy(this._onRestoreClick, this));
      controls.on('click', '.mf-label-message-link', $.proxy(this._onAddLabelToMessageClick, this));    
      controls.on('click', '.cm-add-label-message-menu', $.proxy(this._onAddLabelMenuClick, this));     
      controls.on('click', '.cm-mark-unread-message', $.proxy(this._onMarkUnreadClick, this));
      controls.on('click', '.cm-go-previous', $.proxy(this._onNavigateNewerThreadClick, this));
      controls.on('click', '.cm-go-next', $.proxy(this._onNavigateOlderThreadClick, this));
      this.element.on('click', '.cm-message-reply-link', $.proxy(this._onReplyClick, this));    
      this.element.on('click', '.cm-message-reply-all-link', $.proxy(this._onReplyAllClick, this));    
    },
    
    setOlderThreadId : function (olderThreadId) {
      this._olderThreadId = olderThreadId;
      if (this._olderThreadId)
        $(".cm-go-next").closest(".mf-tool-container").removeClass("disabled");
      else
        $(".cm-go-next").closest(".mf-tool-container").addClass("disabled");
    },
    
    setNewerThreadId : function (newerThreadId) {
      this._newerThreadId = newerThreadId;
      if (this._newerThreadId)
        $(".cm-go-previous").closest(".mf-tool-container").removeClass("disabled");
      else
        $(".cm-go-previous").closest(".mf-tool-container").addClass("disabled");
    },
    
    _onNavigateNewerThreadClick: function (event) {
      if (!$(event.target).closest(".mf-tool-container").hasClass("disabled")) {
        if (this._newerThreadId)
          this.loadThread(this._folderId, this._newerThreadId)
      }
    },
    
    _onNavigateOlderThreadClick: function (event) {
      if (!$(event.target).closest(".mf-tool-container").hasClass("disabled")) {
        if (this._olderThreadId)
          this.loadThread(this._folderId, this._olderThreadId)
      }
    },
    
    loadThread: function (folderId, threadId) {
      this._threadId = threadId;
      this._folderId = folderId;
      
      var communicator = $(".communicator").communicator("instance");
      var folderController = communicator.folderController(folderId);
      
      folderController.loadThread(threadId, 0, 0, $.proxy(function (err, thread) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.showmessage.thread.error'));
        } else {
          var messages = $.map(thread.messages, function (message) {
            return $.extend(message, {
              folderId: folderId
            });
          });

          var labels = $.map(thread.labels, function (label) {
            return $.extend(label, {
              hexColor: communicator.colorIntToHex(label.labelColor)
            });
          });
          
          
          this.setOlderThreadId(thread.olderThreadId);
          this.setNewerThreadId(thread.newerThreadId);
          
          renderDustTemplate('communicator/communicator_items_open.dust', {
            messages: messages,
            labels: labels,
            isStudent: $('.communicator').attr('data-student') == 'true' ? 1 : ''
          }, $.proxy(function(text) {
            this.element.html(text);
            
            var folderController = communicator.folderController(folderId);
            folderController.markAsRead(threadId, function () {
              mApi().communicator.cacheClear();
              $(document).trigger("Communicator:messageread");
            });    
          }, this));
        }         
      }, this));
    },
    
    _onBackClick: function () {
      this.element.closest('.communicator') 
        .communicator('reloadFolder');
    },
    
    _onDeleteClick: function () {
      this.element.closest('.communicator') 
        .communicator('deleteThread', this._folderId, this._threadId);
    },
    
    _onRestoreClick: function () {
      this.element.closest('.communicator')
        .communicator('restoreThread', this._folderId, this._threadId);
    },
    
    _onAddLabelMenuClick: function (event) {
      
      var labelObjs = $('.cm-categories').find('.mf-label');      
      var labels = [];
      var messageLabels = [];
      var labelOccurrances = {};
      var threadLabels = $(".cm-thread-container").find('.cm-message-label');

      $.each(threadLabels, function(key, label) {
        var labelId = $(label).attr('data-label-id');
        if( messageLabels.indexOf(labelId) == -1){
          messageLabels.push(labelId);
          labelOccurrances[labelId] = 1; 
        }else{  
          labelOccurrances[labelId]++;
        }
      });
      
      $.each(labelObjs, function(key, value){
        var lName = $(value).attr('data-folder-name');
        var lStyle = $(value).find('.cm-label-name').attr('style');
        var lId = $(value).attr('data-label-id');
        var lSelected = messageLabels.indexOf(lId) == -1 ? false : true; 
        labels.push({name: lName, id: lId, selected: lSelected, style: lStyle, thread : true });
        
      });

      renderDustTemplate('communicator/communicator_label_link.dust', labels, $.proxy(function (text) {
        $(".mf-tool-label-container").html(text);        
        $('#communicatorNewlabelField').on('input', $.proxy( $(".cm-messages-container").communicatorMessages._onLabelFilterInputChange, this));
      }, this));
      
      $(event.target).closest('.mf-tool-container').find('.cm-label-menu').toggle();
    },
    _onAddLabelToMessageClick: function (event) {  
      var clickedLabel = $(event.target).closest('.mf-label-message-link');
      var lId = $(clickedLabel).attr('data-label-id');
      var messageThread = $('.cm-thread-container').find('.cm-message:first-child');
      var messageThreads = $('.cm-thread-container').find('.cm-message');
      var labelElement = messageThread.find('.cm-message-label[data-label-id=' + lId + ']');
      var messageThreadId = messageThread.attr('data-thread-id');
      var messageLabelId = labelElement.attr('data-message-label-id');        
        
        if (labelElement.length) {
          mApi().communicator.messages.labels.del(messageThreadId, messageLabelId).callback($.proxy(function (err, results) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.communicator.label.create.error.remove"));
            } else {
              var thisThreadElement = $('.cm-message[data-thread-id="' + messageThreadId + '"]');
              var thisLabel = thisThreadElement.find('.cm-message-label[data-label-id=' + lId + ']');
              thisLabel.remove();
              $(clickedLabel).removeClass('selected');
            }
          }, this));
        } else {
          mApi().communicator.messages.labels.create(messageThreadId, { labelId: lId }).callback($.proxy(function (err, label) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.communicator.label.create.error.add"));
            } else {
              var communicator = $(".communicator").communicator("instance");
              label["hexColor"] = communicator.colorIntToHex(label.labelColor);
              renderDustTemplate('communicator/communicator_item_label.dust', label, $.proxy(function (text) {
                $(clickedLabel).addClass('selected');    
                messageThreads.find('.cm-message-header').append($(text));
              }, this));
            }
          }, this));
        }
     },    
    
    _onMarkUnreadClick: function (event) {
      var threads = [
          {
            folderId: this._folderId,
            id: this._threadId
          }
      ];
      this.element.closest('.communicator') 
        .communicator('markUnreadThreads', threads);
    },
    
    _onReplyClick: function (event) {
      var messageId = $(event.target)
        .closest('.cm-message')
        .attr('data-id');
      
      this.element.closest('.communicator') 
        .communicator('newMessageDialog', {
          mode: "reply",
          replyThreadId: this._threadId, 
          replyMessageId: messageId 
        }
      );
    },
    _onReplyAllClick: function (event) {
      var messageId = $(event.target)
        .closest('.cm-message')
        .attr('data-id');
      
      this.element.closest('.communicator') 
        .communicator('newMessageDialog', {
          mode: "replyall",
          replyThreadId: this._threadId, 
          replyMessageId: messageId
        }
      );
    }
  });
  
  $(document).ready(function() {
    webshim.polyfill('forms');
    $('.communicator').communicator({
      maxMessageCount: 50,
      groupMessagingPermission: $('.communicator').attr('data-group-messaging-permission') == 'true',
      isStudent: $('.communicator').attr('data-student') == 'true'
    });
  });

}).call(this);
