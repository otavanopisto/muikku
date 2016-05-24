(function() {
  'use strict';
  
  var CommunicatorFolderController = function (options) {
    this.options = options;
  };
  
  $.extend(CommunicatorFolderController.prototype, {
    
    loadItemDetails: function (item, itemCallback) {
      var recipientIds = item.recipientIds||[];
      var recipientCount = recipientIds.length;
      
      var recipientCalls = $.map(recipientIds.slice(0, 5), function (recipientId) {
        return function (callback) {
          mApi().communicator.communicatormessages.recipients.info
            .read(item.id, recipientId)
            .callback(callback);
        };
      });
      
      var countCall = function (countCallback) {
        mApi().communicator.messages.messagecount
          .read(item.communicatorMessageId)
          .callback(countCallback);
      };
      
      var senderCall = function (senderCallback) {
        mApi().communicator.communicatormessages.sender
          .read(item.id)
          .callback(senderCallback);
      };
      
      var recipientBatchCall = function (recipientsCallback) {
        async.parallel(recipientCalls, recipientsCallback);
      }
      
      async.parallel([recipientBatchCall, countCall, senderCall], function (err, results) {
        if (err) {
          itemCallback(err);
        } else {
          var recipients = results[0];
          var count = results[1];
          var sender = results[2];
          
          itemCallback(null, {
            recipientCount: recipientCount,
            recipients: recipients,
            sender: sender,
            count: count
          });
        }
      });
    },
    
    loadItems: function (firstResult, maxResults, mainCallback) {
      throw Error("loadItems not implemented");
    },
    
    removeItems: function (ids, callback) {
      throw Error("removeItem not implemented");
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
      mApi().communicator.items
        .read({
          firstResult: firstResult,
          maxResults: maxResults
        })
        .on('$', $.proxy(function (item, itemCallback) {
          this.loadItemDetails(item, function (err, details) {
            if (err) {
              itemCallback(err);
            } else {
              item.sender = details.sender;
              item.recipientCount = details.recipientCount;
              item.recipients = details.recipients;
              item.messageCount = details.count;
              itemCallback();
            }
          });
        }, this))
        .callback(mainCallback);
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
        .on('$', $.proxy(function (item, itemCallback) {
          this.loadItemDetails(item, function (err, details) {
            if (err) {
              itemCallback(err);
            } else {
              item.sender = details.sender;
              item.recipientCount = details.recipientCount;
              item.recipients = details.recipients;
              item.messageCount = details.count;
              itemCallback();
            }
          });
        }, this))
        .callback(mainCallback);
    }
  });
  
  $.widget("custom.communicatorMessages", {
    _create : function() {
      this._firstItem = 0;
      this._items = [];
      this._folderId = this.options.folderId;
      
      this.element.on('click', '.cm-page-link-load-more:not(.disabled)', $.proxy(this._onMoreClick, this));
      this.element.on('click', '.icon-delete', $.proxy(this._onDeleteClick, this));
      this.element.on('click', '.cm-message-header-container', $.proxy(this._onMessageHeaderClick, this));
      $(document).on("Communicator:newmessagereceived", $.proxy(this._onNewMessageReceived, this));
    },
    
    loadFolder: function (id) {
      this._folderId = id;
      this._reload();
    },
    
    folderId: function () {
      return this._folderId;
    },
    
    _getSelectedThreads: function () {
      return $.map(this.element.find('input[name="messageSelect"]:checked'), function (input) {
        var message = $(input).closest('.cm-message');
        return {
          folderId: message.attr('data-folder-id'),
          id: message.attr('data-thread-id')
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
          var hasMore = false;
          
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
          
          renderDustTemplate('communicator/communicator_items.dust', { items: data, sent: this._folderId == 'sent' }, $.proxy(function (text) {
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
    
    _onMoreClick: function (event) {
      this._loadMore($.proxy(function () {
        $('.cm-page-link-load-more')[0].scrollIntoView();
      }, this));
    },
    
    _onDeleteClick: function (event) {
      var selectedThreads = this._getSelectedThreads();
      this.element.closest('.communicator') 
        .communicator('deleteThreads', selectedThreads);
    },
    
    _onMessageHeaderClick: function (event) {
      var threadId = $(event.target).closest('.cm-message')
        .attr('data-thread-id');
      
      this.element.closest('.communicator') 
        .communicator('loadThread', threadId);
    }
    
  });

  $.widget("custom.communicator", {
    
    options: {
      defaultFolderId: 'inbox'
    },
    
    _create : function() {
      this._folderControllers = {
        'inbox': new CommunicatorInboxFolderController(),
        'sent': new CommunicatorSentFolderController()
      };

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
      
      this.element.find('.cm-messages-container').communicatorMessages({
        maxMessageCount: this.options.maxMessageCount,
        folderId: folderId
      });
      
      this.element.find('.cm-thread-container').communicatorThread();
     
      this.element.on('click', '.cm-new-message-button', $.proxy(this._onNewMessageButtonClick, this));
      this.element.on('click', '.communicator-folder', $.proxy(this._onCommunicatorFolderClick, this));
      
      if (threadId) {
        this.loadThread(threadId);
      } else {
        this.loadFolder(folderId);
      }
    },
    
    loadFolder: function (id) {
      this._updateHash(id, null);
      this._updateSelected(id);
      
      this.element.find('.cm-thread-container').hide();
      this.element.find('.cm-messages-container')
        .communicatorMessages('loadFolder', id)
        .show();
    },
    
    reloadFolder: function () {
      var folderId = this.element.find('.cm-messages-container')
        .communicatorMessages('folderId');
    
      this.loadFolder(folderId);
    },
    
    loadThread: function (threadId) {
      var folderId = this.element.find('.cm-messages-container')
        .communicatorMessages('folderId');
      
      this._updateHash(folderId, threadId);
      this._updateSelected(folderId);
      
      this.element.find('.cm-messages-container').hide();
      this.element.find('.cm-thread-container')
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
      }, this));
    },
    
    folderController: function (folderId) {
      return this._folderControllers[folderId];
    },
        
    newMessageDialog: function (options) {
      var dialog = $('<div>')
        .communicatorCreateMessageDialog($.extend(options||{}, {
          groupMessagingPermission: this.options.groupMessagingPermission
        }));
      
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
      this.element.find('.communicator-folder')
        .removeClass('selected');
      this.element.find('.communicator-folder[data-folder-id="' + id + '"]')
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
    
    _onNewMessageButtonClick: function (event) {
      this.newMessageDialog();
    },
    
    _onCommunicatorFolderClick: function (event) {
      var folderId = $(event.target).closest('.communicator-folder')
        .attr('data-folder-id');
      
      this.loadFolder(folderId);
    }
    
  });
  
  $.widget("custom.communicatorCreateMessageDialog", {
    
    options: {
      groupMessagingPermission: false,
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
        extraPlugins: {
          'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.8/',
          'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.1/plugin.min.js',
          'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.1/plugin.min.js'
        }
      }
    },
    
    _create : function() {
      var extraPlugins = [];
      
      $.each($.extend(this.options.ckeditor.extraPlugins, {}, true), $.proxy(function (plugin, url) {
        CKEDITOR.plugins.addExternal(plugin, url);
        extraPlugins.push(plugin);
      }, this));
      
      this.options.ckeditor.extraPlugins = extraPlugins.join(',');
      
      this.element.on('click', 'input[name="send"]', $.proxy(this._onSendClick, this));
      this.element.on('click', 'input[name="cancel"]', $.proxy(this._onCancelClick, this));
      this.element.on('click', '.cm-message-recipient', $.proxy(this._onRecipientClick, this));
      
      this._load($.proxy(function () {
        this._contentsEditor = CKEDITOR.replace(this.element.find('textarea[name="content"]')[0], $.extend(this.options.ckeditor, {
          draftKey: 'communicator-new-message',
          on: {
            instanceReady: $.proxy(this._onCKEditorReady, this)
          }
        }));
        
        var autocomplete = this.element.find('input[name="recipient"]').autocomplete({
          open: function(event, ui) {
            $(event.target).perfectScrollbar({
              wheelSpeed:3,
              swipePropagation:false
            });
          },  
          source: $.proxy(function (request, response) {
            this._searchRecipients(request.term, function (err, results) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', err);
              } else {
                response(results);
              }
            });
          }, this),
          select: $.proxy(function (event, ui) {
            var item = ui.item;
            if (!item.existing) {
              this._addRecipient(item.type, item.id, item.label);
              $(event.target).val("");
            }
            return false;
          }, this),
          
          appendTo: '#msgRecipientsContainer'
        });
        
        autocomplete.data("ui-autocomplete")._renderItem = function (ul, item) {
          var li = $("<li>")
            .text(item.label)
            .appendTo(ul);
          
          if (item.existing) {
            li.attr("data-existing", "true");
          }
        
          return li;
        };
      }, this));
    },
    
    _destroy: function () {
      try {
        this._contentsEditor.destroy();
      } catch (e) {
      }
    },
    
    _createRecipientLoad: function (messageId) {
      return $.proxy(function (callback) {
        mApi().communicator.communicatormessages.read(messageId)
          .on('$', function(reply, replyCallback) {
            mApi().communicator.communicatormessages.sender
              .read(messageId)
              .callback(function(err, user) {
                reply.senderFullName = user.firstName + ' ' + user.lastName;
                reply.senderHasPicture = user.hasImage;
                replyCallback();
              });
          })
          .callback(callback);
      }, this);
    },
    
    _load: function (callback) {
      var taskIds = [];
      var tasks = [];
      
      if (this.options.replyMessageId) {
        taskIds.push('replyMessage');
        tasks.push(this._createRecipientLoad(this.options.replyMessageId));
      } 
      
      async.parallel(tasks, $.proxy(function (err, results) {
        var data = {};
        $.each(taskIds, function (taskIndex, taskId) {
          data[taskId] = results[taskIndex];
        });
        
        renderDustTemplate('/communicator/communicator_create_message.dust', data, $.proxy(function (text) {
          this.element.html(text);
          if (data.replyMessage) {
            this._addRecipient('USER', data.replyMessage.senderId, data.replyMessage.senderFullName);
          }

          if (callback) {
            callback();
          }
        }, this));
      }, this));
    },
    
    _addRecipient: function (type, id, label) {
      var parameters = {
        id: id,
        name: label,
        type: type
      };
      
      switch (type) {
        case 'USER':
          renderDustTemplate('communicator/communicator_messagerecipient.dust', parameters, $.proxy(function (text) {
            this.element.find('.cm-message-recipients').prepend(text);
          }, this));
        break;
        case 'GROUP':
          renderDustTemplate('communicator/communicator_messagerecipientgroup.dust', parameters, $.proxy(function (text) {
            this.element.find('.cm-message-recipients').prepend(text);
          }, this));
        break;
        case 'WORKSPACE':
          renderDustTemplate('communicator/communicator_messagerecipientworkspace.dust', parameters, $.proxy(function (text) {
            this.element.find('.cm-message-recipients').prepend(text);
          }, this));
        break;
      }
    },
    
    _getRecipientIds: function () {
      return $.map(this.element.find('input[name="recipientIds"]'), function (input) {
        return parseInt($(input).val());
      });
    },
    
    _getRecipientGroupIds: function () {
      return $.map(this.element.find('input[name="recipientGroupIds"]'), function (input) {
        return parseInt($(input).val());
      });
    },
    
    _getExistingWorkspaceIds: function () {
      return $.map(this.element.find('input[name="recipientStudentsWorkspaceIds"],input[name="recipientTeachersWorkspaceIds"]'), function (input) {
        return parseInt($(input).val());
      });
    },
    
    _createWorkspaceSearch: function (term) {
      var existingWorkspaceIds = this._getExistingWorkspaceIds();
      
      return $.proxy(function (callback) {
        mApi().coursepicker.workspaces
          .read({
            search: term,
            myWorkspaces: true,
          })
          .callback($.proxy(function (err, results) {
            if (err) {
              callback(err);
            } else {
              callback(null, $.map(results||[], function (result) {
                return {
                  category: getLocaleText("plugin.communicator.workspaces"),
                  label : result.name + (result.nameExtension ? ' (' + result.nameExtension + ')' : ''),
                  id: result.id,
                  type : "WORKSPACE",
                  existing: existingWorkspaceIds.indexOf(result.id) != -1
                };
              }));
            }
          }, this));
      }, this);
    },
    
    _createGroupSearch: function (term) {
      var existingGroupIds = this._getRecipientGroupIds();
      
      return $.proxy(function (callback) {
        mApi().usergroup.groups
          .read({ 'searchString' : term })
          .callback(function(err, results) {
            if (err) {
              callback(err);
            } else {
              callback(null, $.map(results||[], function (result) {
                return {
                  category: getLocaleText("plugin.communicator.usergroups"),
                  label : result.name + " (" + result.userCount + ")",
                  id: result.id,
                  type : "GROUP",
                  existing: existingGroupIds.indexOf(result.id) != -1
                };
              }));
            }
          });
      }, this);
    },
    
    _createUserSearch: function (term) {
      var existingUserIds = this._getRecipientIds();
      
      return $.proxy(function (callback) {
        mApi().user.users
          .read({ 'searchString' : term })
          .callback(function(err, results) {
            if (err) {
              callback(err);
            } else {
              callback(null, $.map(results||[], function (result) {
                var label = result.firstName + " " + result.lastName;
                if (result.email) {
                  label = label + " (" + result.email + ")"
                }
                
                return {
                  category: getLocaleText("plugin.communicator.users"),
                  label : label,
                  id: result.id,
                  type : "USER",
                  img: result.hasImage ? "/picture?userId=" + result.id : null,
                  existing: existingUserIds.indexOf(result.id) != -1
                };
              }));
            }
          });
      }, this);
    },
    
    _searchRecipients: function (term, callback) {
      var tasks = [this._createUserSearch(term), this._createWorkspaceSearch(term)];

      if (this.options.groupMessagingPermission) {
        tasks.push(this._createGroupSearch(term));
      }
      
      async.parallel(tasks, function (err, results) {
        if (err) {
          callback(err);
        } else {
          callback(null, _.flatMap(results)); 
        }
      });
    },
    
    _discardDraft: function () {
      try {
        this._contentsEditor.discardDraft();
      } catch (e) {
      }
    },
    
    _onSendClick: function (event) {
      this.element.addClass('loading');
      
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        var caption = this.element.find('input[name="caption"]').val();
        var content = this._contentsEditor.getData();

        if (!caption || !caption.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.validation.notitle'));
          return false;
        }
        
        if (!content || !content.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.validation.nomessage'));
          return false;
        }
        
        var payload = {
          caption: caption,  
          content: content,
          categoryName: "message" 
        };
        
        $.each(['recipientIds', 'recipientGroupIds', 'recipientStudentsWorkspaceIds', 'recipientTeachersWorkspaceIds'], $.proxy(function (index, name) {
          var values = $.map(this.element.find('input[name="' + name + '"]'), function (input) {
            return $(input).val();
          });
          
          payload[name] = values;
        }, this));
            
        if (!payload.recipientIds.length && !payload.recipientGroupIds.length && !payload.recipientStudentsWorkspaceIds.length && !payload.recipientTeachersWorkspaceIds.length) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.validation.norecipients'));
          return false;
        }
        
        if (this.options.replyThreadId) {
          mApi().communicator.messages
          .create(this.options.replyThreadId, payload)
          .callback($.proxy(function (err, result) {
            this._discardDraft();
            
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.infomessage.newMessage.error'));
            } else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.communicator.infomessage.newMessage.success'));
              this.element.removeClass('loading');
              window.location.reload(true);
            }
          }, this));
        } else {
          mApi().communicator.messages
            .create(payload)
            .callback($.proxy(function (err, result) {
              this._discardDraft();
              
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.infomessage.newMessage.error'));
              } else {
                $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.communicator.infomessage.newMessage.success'));
                this.element.removeClass('loading');
                window.location.reload(true);
              }
            }, this));
        }
      }
    },
    
    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    },
    
    _onRecipientClick: function (event) {
      $(event.target).closest('.cm-message-recipient')
        .remove();
    },
    
    _onCKEditorReady: function (e) {
      this.element.find('input[name="send"]').removeAttr('disabled'); 
    }
    
  });
  
  $.widget("custom.communicatorThread", {
    _create : function() {
      this._threadId = null;
      
      this.element.on('click', '.icon-goback', $.proxy(this._onBackClick, this));
      this.element.on('click', '.icon-delete', $.proxy(this._onDeleteClick, this));
      this.element.on('click', '.cm-message-reply-link', $.proxy(this._onReplyClick, this));
    },
    
    loadThread: function (folderId, threadId, callback) {
      this._threadId = threadId;
      this._folderId = folderId;
      
      mApi().communicator.messages
        .read(threadId)
        .on("$", function (message, messageCallback) {
          mApi().communicator.communicatormessages.sender.read(message.id).callback(function (err, user) {  
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
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.showmessage.thread.error'));
          } else {
            var data = $.map(messages, function (message) {
              return $.extend(message, {
                folderId: folderId
              });
            });
            
            renderDustTemplate('communicator/communicator_items_open.dust', data , $.proxy(function(text) {
              this.element.html(text);
              mApi().communicator.messages.markasread.create(threadId).callback(function () {
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
    
    _onReplyClick: function (event) {
      var messageId = $('.cm-message').attr('data-id');
      this.element.closest('.communicator') 
        .communicator('newMessageDialog', {
          replyThreadId: this._threadId, 
          replyMessageId: messageId 
        });
    }
    
  });
  
  $(document).ready(function() {
    webshim.polyfill('forms');
    $('.communicator').communicator({
      maxMessageCount: 50,
      groupMessagingPermission: $('.communicator').attr('data-group-messaging-permission') == 'true'
    });
  });

}).call(this);