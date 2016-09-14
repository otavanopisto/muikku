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
      
      var labelsCall = function (labelsCallback) {
        mApi().communicator.messages.labels
          .read(item.communicatorMessageId)
          .callback(labelsCallback);
      }
      
      async.parallel([recipientBatchCall, countCall, senderCall, labelsCall], function (err, results) {
        if (err) {
          itemCallback(err);
        } else {
          var recipients = results[0];
          var count = results[1];
          var sender = results[2];
          var labels = results[3];

          var communicator = $(".communicator").communicator("instance");
          
          for (var i = 0, l = labels.length; i < l; i++) {
            labels[i]["colorHex"] = communicator.colorIntToHex(labels[i].labelColor);
          }
          
          itemCallback(null, {
            recipientCount: recipientCount,
            recipients: recipients,
            sender: sender,
            count: count,
            labels: labels
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
  
  var CommunicatorInboxFolderController = function (labelId, options) {
    this._super = CommunicatorFolderController.prototype;
    this._labelId = labelId;
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
      
      if (this._labelId)
        params.labelId = this._labelId;
        
      mApi().communicator.items
        .read(params)
        .on('$', $.proxy(function (item, itemCallback) {
          this.loadItemDetails(item, function (err, details) {
            if (err) {
              itemCallback(err);
            } else {
              item.sender = details.sender;
              item.recipientCount = details.recipientCount;
              item.recipients = details.recipients;
              item.messageCount = details.count;
              item.labels = details.labels;
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
              item.labels = details.labels;
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
      $('.mf-controls-container').on('click', '.mf-label-link', $.proxy(this._onAddLabelToMessagesClick, this));
      $('.mf-controls-container').on('click', '.icon-delete', $.proxy(this._onDeleteClick, this));
      $('.mf-controls-container').on('click', '.cm-add-label-menu', $.proxy(this._onAddLabelMenuClick, this));         
      $('.mf-controls-container').on('click', '#newLabelSubmit', $.proxy(this._onCreateLabelClick, this));   
      this.element.on('click', '.cm-page-link-load-more:not(.disabled)', $.proxy(this._onMoreClick, this));
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
    },

    _onAddLabelMenuClick: function (event) {
      var labelObjs = $('.cm-categories').find('.mf-label');      
      
      var labels = [];
      
      $.each(labelObjs, function(key, value){
        var label = {};
        var n = $(value).attr('data-folder-name');
        var i = $(value).attr('data-label-id');
        
        labels.push({name: n, id: i});
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
      var lId = $(event.target).closest('.mf-label-link').attr('data-label-id');
      var addLabelChanges = [];
      var removeLabelChanges = [];
      var checkedMessageThreads = $('.cm-messages-pages').find('input[name="messageSelect"]:checked');
       
      $.each(checkedMessageThreads, function(key, value) {
        var inputElement = $(value);
        var labelElement = inputElement.closest('.cm-message').find('.cm-message-label[data-label-id=' + lId + ']');

        var messageId = inputElement.attr('value');
        var messageLabelId = labelElement.attr('data-message-label-id');        
        
        if (labelElement.length) {
          mApi().communicator.messages.labels.del(messageId, messageLabelId).callback($.proxy(function (err, results) {
            if (err) {
              alert("Labelin poisto kosahti");
            } else {
              var communicator = $(".communicator").communicator("instance");
              var messageThreadElement = $('.cm-message[data-thread-id="' + messageId + '"]');
              var labelElement = messageThreadElement.find('.cm-message-label[data-label-id=' + lId + ']');
              labelElement.remove();
            }
          }, this));
        } else {
          mApi().communicator.messages.labels.create(messageId, { labelId: lId }).callback($.proxy(function (err, label) {
            if (err) {
              alert("Labelin lisäys kosahti");
            } else {
              var communicator = $(".communicator").communicator("instance");
              var messageThreadElement = $('.cm-message[data-thread-id="' + label.messageThreadId + '"]');
              
              label["colorHex"] = communicator.colorIntToHex(label.labelColor);
              
              renderDustTemplate('communicator/communicator_item_label.dust', label, $.proxy(function (text) {
                messageThreadElement.find('.cm-message-header-content-secondary').append($(text));
              }, this));
            }
          }, this));
        }
      });
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
      var colorHex = communicator.colorIntToHex(color);
      if (name != '') {
        if (labels.indexOf(name) == -1) {
          communicator.createLabel(name, colorHex);
        } else {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.communicator.label.create.error.alreadyexists"));
        }
      } else {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.communicator.label.create.error.empty"));
      }
    }
  });
  
  $.widget("custom.messageTools", {
	 options:{
		  toolset : 'thread'
	 },

	 _create : function(){
		   switch(this.options.toolset) {
		    case 'message':
		      var toolTemplate = 'communicator/communicator_tools_message.dust';
		      this.loadTools(toolTemplate);
		      break;
		    default:
          var toolTemplate = 'communicator/communicator_tools_thread.dust';		      
          this.loadTools(toolTemplate);
		   }
	 },
	 
   loadTools: function(toolSet) {
     renderDustTemplate(toolSet, {}, $.proxy(function (text) {
       this.element.html(text);
     }, this));
   }
  }); 
  

  $.widget("custom.communicator", {
    
    options: {
      defaultFolderId: 'inbox'
    },
    _create : function() {
      this.loadLabels($.proxy(
        function (err, labels) {
          this._folderControllers = {
            'inbox': new CommunicatorInboxFolderController(),
            'sent': new CommunicatorSentFolderController()
          };
          
          if (err) {
          } else {
            var addLabelControlsCalls = $.map(labels, $.proxy(function (label) {
              return $.proxy(function (callback) {
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
    
    loadFolder: function (id) {
      this._updateHash(id, null);
      this._updateSelected(id);
      
      this.element.find('.cm-thread-container').hide();
      $('.mf-controls-container').messageTools( 'loadTools', 'communicator/communicator_tools_thread.dust');       
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
      $('.mf-controls-container').messageTools( 'loadTools', 'communicator/communicator_tools_message.dust');     
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

    createLabel: function (name, colorHex) {
      var colorInt = this.hexToColorInt(colorHex);
      var label = {
        name: name,
        color: colorInt
      };
      
      mApi().communicator.userLabels.create(label).callback($.proxy(function (err, label) {
        if (err) {
          // TODO
        } else {
          this.addLabelControl(label, $.proxy(function () {
            this._sortLabels();
          }, this));
        }
      }, this));
    },
    
    updateLabel: function (id, name, colorHex) {
      var colorInt = this.hexToColorInt(colorHex);
      var label = {
        id: id,
        name: name,
        color: colorInt
      };
      
      mApi().communicator.userLabels.update(id, label).callback($.proxy(function (err, label) {
        if (err) {
          // TODO
        } else {
        }
      }, this));
    },

    deleteLabel: function (id) {
      mApi().communicator.userLabels.del(id).callback($.proxy(function (err, label) {
        if (err) {
          // TODO
        } else {
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
        var label = results;
        label.colorHex =  communicator.colorIntToHex(label.color);
        renderDustTemplate('communicator/communicator_label_edit.dust', label, $.proxy(function(text) {
          this._dialog = $(text);      
          $(this._dialog).dialog(
            {
              'title' : getLocaleText("plugin.communicator.label.edit.caption"),              
              buttons : [ {

                 'text' :  getLocaleText("plugin.communicator.label.edit.button.send"),
                 'class' : 'save-button',
                 'click' : function() {
                     
                     var id = $(this).find("input").attr('data-id');
                     var name = $(this).find("input").val();
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
      this._folderControllers[ "label-" + label.id ] = new CommunicatorInboxFolderController(label.id);
      
      label.hexColor = this.colorIntToHex(label.color);

      renderDustTemplate('/communicator/communicator_label.dust', label, $.proxy(function (text) {
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
    
    _onNewMessageButtonClick: function (event) {
      this.newMessageDialog();
    },
    
    _onCommunicatorFolderClick: function (event) {
      var folderId = $(event.target).closest('.cm-folder')
        .attr('data-folder-id');
      
      this.loadFolder(folderId);
    }
    
  });
  
  $.widget("custom.communicatorCreateMessageDialog", {
    
    options: {
      groupMessagingPermission: false,
      ckeditor: {
        uploadUrl: '/communicatorAttachmentUploadServlet',
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
          'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.9/',
          'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.9/',
          'filetools' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/filetools/4.5.9/',
          'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.9/',
          'notificationaggregator' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notificationaggregator/4.5.9/',
          'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
          'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.1/plugin.min.js',
          'uploadwidget' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadwidget/4.5.9/',
          'uploadimage' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadimage/4.5.9/'
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
      var controls = $('.mf-controls-container');
      this._threadId = null;
      controls.on('click', '.icon-goback', $.proxy(this._onBackClick, this));
      controls.on('click', '.icon-delete', $.proxy(this._onDeleteClick, this));
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
      var messageId = $(event.target)
        .closest('.cm-message')
        .attr('data-id');
      
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