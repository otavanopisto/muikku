(function() {
  'use strict';
  
  window.DiscussionIOController = function (options) {
    this.options = options;
  };
  
  $.extend(window.DiscussionIOController.prototype, {
  
  });
  
  $.widget("custom.discussion", {
    
    _create : function() {
      this.element.addClass('discussion');
      
      this._areaId = null;
      
      this.element.on("change", "select[name='areas']", $.proxy(this._onAreaSelectChange, this));
      this.element.on("click", ".di-new-area-button", $.proxy(this._onNewAreaClick, this));
      this.element.on("click", ".di-new-message-button", $.proxy(this._onNewMessageClick, this));
      this.element.on("click", ".di-edit-area-button", $.proxy(this._onEditMessageClick, this));
      this.element.on("click", ".di-delete-area-button", $.proxy(this._onDeleteMessageClick, this));

      this.element.find('.di-threads')
        .show()
        .discussionThreads({
          ioController: this.options.ioController
        });
      
      this.element.find('.di-thread')
        .hide()
        .discussionThread({
          ioController: this.options.ioController
        });
      
      this._load($.proxy(function () {
        var areaId = null;
        var threadId = null;
        this._allAreas = false;
        
        if (window.location.hash.length > 1) {
          var hashParts = window.location.hash.substring(1).split('/');
          if (hashParts.length > 0) {
            areaId = hashParts[0];
          }

          if (hashParts.length > 1) {
            threadId = hashParts[1];
          }
          
          if (areaId) {
            if (areaId.charAt(0) == 'a') {
              areaId = areaId.substring(1);
              this._allAreas = true;
            }
          }
        } else {
          this._allAreas = true;
        }
        
        if (areaId && threadId) {
          this.loadThread(areaId, threadId);
        } else {
          if (!areaId || this._allAreas) {
            this.loadAllAreas();
          } else {
            this.loadArea(areaId);
          }
        }
      }, this)); 
    },
    
    loadAllAreas: function () {
      this._threadId = null;
      this._areaId = null;
      this._allAreas = true;
      this._updateHash();
      this.element.find("select[name='areas']").val('all');
      this._loadThreads('all');
    },
    
    loadArea: function (areaId) {
      this._threadId = null;
      this._areaId = areaId;
      this._allAreas = false;
      this._updateHash();
      this.element.find("select[name='areas']").val(areaId);
      this._loadThreads(areaId);
    },
    
    reloadArea: function () {
      if (this._allAreas) {
        this.loadAllAreas();
      } else {
        this.loadArea(this._areaId);
      }
    },
    
    reloadAreas: function () {
      var tasks = [this._createAreasLoad()];
      async.parallel(tasks, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var areas = results[0];
          this._buildAreaSelect(areas);
          if (this._allAreas) {
            this.loadAllAreas();
          } else {
            if (_.flatMap(areas, 'id').indexOf(parseInt(this._areaId)) != -1) {
              this.loadArea(this._areaId);
            } else {
              this.loadAllAreas();
            }
          }
        }
      }, this));
    },
    
    loadThread: function (areaId, threadId) {
      this._threadId = threadId;
      this._areaId = areaId;
      this._updateHash();
      
      if (this._allAreas) {
        this.element.find("select[name='areas']").val('all');      
      } else {
        this.element.find("select[name='areas']").val(areaId);
      }
      
      this._loadThread(areaId, threadId);
    },
    
    reloadThread: function () {
      this.loadThread(this._areaId, this._threadId);
    },
        
    newAreaDialog: function () {
      var dialog = $('<div>')
        .discussionNewAreaDialog({
          ioController: this.options.ioController
        });
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
        
    editAreaDialog: function (areaId) {
      var dialog = $('<div>')
        .discussionEditAreaDialog({
          ioController: this.options.ioController,
          areaId: areaId
        });
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
        
    deleteAreaDialog: function (areaId) {
      var dialog = $('<div>')
        .discussionDeleteAreaDialog({
          ioController: this.options.ioController,
          areaId: areaId
        });
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
    
    newMessageDialog: function (options) {
      var dialog = $('<div>')
        .discussionNewMessageDialog($.extend({
          ioController: this.options.ioController
        }, options||{}));
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
    
    replyMessageDialog: function (options) {
      var dialog = $('<div>')
        .discussionReplyMessageDialog($.extend({
          ioController: this.options.ioController
        }, options||{}));
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
    
    editMessageDialog: function (options) {
      var dialog = $('<div>')
        .discussionEditMessageDialog($.extend({
          ioController: this.options.ioController
        }, options||{}));
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
    
    editReplyDialog: function (options) {
      var dialog = $('<div>')
        .discussionEditReplyDialog($.extend({
          ioController: this.options.ioController
        }, options||{}));
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
    
    mayRemoveThread: function (areaId) {
      return this.options.areaPermissions[areaId] && this.options.areaPermissions[areaId].removeThread;
    },
    
    _updateHash: function () {
      if (this._allAreas) {
        if (this._areaId && this._threadId) {
          window.location.hash = "#a" + this._areaId + "/" + this._threadId;
        } else {
          window.location.hash = "";
        }
      } else {
        if (this._areaId) {
          if (this._threadId) {
            window.location.hash = "#" + this._areaId + "/" + this._threadId;
          } else {
            window.location.hash = "#" + this._areaId;
          }
        } else {
          window.location.hash = "";
        }
      }
    },
    
    _load: function (callback) {
      var tasks = [this._createAreasLoad()];
      async.parallel(tasks, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var areas = results[0];
          this._buildAreaSelect(areas);
          callback();
        }
      }, this));
    },
    
    _createAreasLoad: function () {
      return $.proxy(function (callback) {
        this.options.ioController.loadAreas(callback);
      }, this);
    },
    
    _buildAreaSelect: function (areas) {
      var areaSelect = $(this.element)
        .find("select[name='areas']")
        .empty();
        
      if (areas && areas.length) {
        $(this.element).find(".di-new-message-button").removeClass("disabled");          
        
        $('<option>')
          .text(getLocaleText('plugin.discussion.browseareas.all'))
          .attr('value', 'all')
          .appendTo(areaSelect);
        
        $.each(areas, function (index, area) {
          if (!area.groupId) {
            $('<option>')
              .attr('value', area.id)
              .text(area.name) 
              .appendTo(areaSelect);
          }
        });
      } else {
        $(this.element).find(".di-new-message-button").addClass("disabled");          
        
        $('<option>')
          .text(getLocaleText('plugin.discussion.selectarea.empty'))
          .appendTo(areaSelect);
      }
    },
    
    _loadThreads: function (areaId) {
      this.element.find('.di-thread')
        .hide();

      this.element.find('.di-threads')
        .show()
        .discussionThreads('loadThreads', areaId); 
    
    },
    
    _loadThread: function (areaId, threadId) {
      this.element.find('.di-thread')
        .discussionThread('loadThread', areaId, threadId)
        .show();

      this.element.find('.di-threads')
        .hide(); 
    },
    
    _onAreaSelectChange: function (event) {
      event.preventDefault();
      var value = $(event.target).val();
      if (value == 'all') {
        this.loadAllAreas();
      } else {
        this.loadArea(value);
      }
    },
    
    _onNewAreaClick: function (event) {
      this.newAreaDialog();
    },
    
    _onNewMessageClick: function (event) {
      var options = {};
      
      if (this._areaId != 'all') {
        options.areaId = this._areaId;
      }
      
      this.newMessageDialog(options);
    },
    
    _onEditMessageClick: function (event) {
      this.editAreaDialog(this._areaId);
    },
    
    _onDeleteMessageClick: function (event) {
      this.deleteAreaDialog(this._areaId);
    }
    
  });
  
  $.widget("custom.discussionThread", {
    
    options: {
      maxReplyCount: 25
    },
    
    _create : function() {
      this._firstResult = 0;
      this._replies = []; 
      
      this.element.on("click", ".icon-goback", $.proxy(this._onBackClick, this));
      this.element.on("click", ".di-remove-thread-link", $.proxy(this._onRemoveClick, this));
      this.element.on("click", ".di-message-reply-link", $.proxy(this._onMessageReplyClick, this));
      this.element.on("click", ".di-message-quote-link", $.proxy(this._onMessageQuoteClick, this));
      this.element.on("click", ".di-message-edit-link", $.proxy(this._onMessageEditClick, this));
      this.element.on("click", ".di-reply-answer-link", $.proxy(this._onReplyAnswerClick, this));
      this.element.on("click", ".di-reply-quote-link", $.proxy(this._onReplyQuoteClick, this));
      this.element.on("click", ".di-reply-edit-link", $.proxy(this._onReplyEditClick, this));
      this.element.on("click", ".di-page-link-load-more-replies", $.proxy(this._onMoreRepliesClickClick, this));
    },
    
    _createThreadLoad: function (areaId, threadId) {
      return $.proxy(function (callback) {
        this.options.ioController.loadThread(areaId, threadId, callback);
      }, this);
    },
    
    _createThreadRepliesLoad: function (areaId, threadId) {
      return $.proxy(function (callback) {
        this.options.ioController.loadThreadReplies(areaId, threadId, this._firstResult, this.options.maxReplyCount + 1, callback);
      }, this);
    },
    
    loadThread: function (areaId, threadId) {
      this.element
        .html('')
        .addClass('loading');
      
      this._firstResult = 0;
      this._replies = [];
      this._areaId = areaId;
      this._threadId = threadId;
      
      var tasks = [this._createThreadLoad(areaId, threadId), this._createThreadRepliesLoad(areaId, threadId)];
      async.parallel(tasks, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var thread = _.clone(results[0]);
          var replies = _.clone(results[1]||[]);
          
          this.options.ioController.loadThreadDetails(thread, $.proxy(function (detailsErr, thread) {
            if (detailsErr) {
              $('.notification-queue').notificationQueue('notification', 'error', detailsErr);
            } else {
              var hasMore = false;
              if (replies.length > this.options.maxReplyCount) {
                hasMore = true;
                replies.pop();
              }
              
              this._thread = thread;
              this._replies = this._replies.concat(replies);
              this._renderReplies(hasMore);
            }
          }, this));
        }
      }, this));
    },
    
    _loadMoreReplies: function () {
      this.element
         .html('')
        .addClass('loading');
    
      this._firstResult += this.options.maxReplyCount;
        
      var tasks = [this._createThreadRepliesLoad(this._areaId, this._threadId)];
      async.parallel(tasks, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var replies = _.clone(results[0]);
          var hasMore = false;
          if (replies.length > this.options.maxReplyCount) {
            hasMore = true;
            replies.pop();
          }
          
          this._replies = this._replies.concat(replies);
          this._renderReplies(hasMore);
        }
      }, this));
      
    },
    
    _renderReplies: function (hasMore) {
      renderDustTemplate('/discussion/discussion_items_open.dust', {
        thread: this._thread,
        replies: this._replies,
        hasMore: hasMore,
        mayRemoveThread : this.element.closest('.discussion').discussion('mayRemoveThread', this._areaId)
      }, $.proxy(function(text) {
        this.element
          .html(text)
          .removeClass('loading');
      }, this));
    },
    
    _removeThread: function () {
      this.options.ioController.deleteThread(this._areaId, this._threadId, $.proxy(function(err, result) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.threadremoved'));
          $('.discussion').discussion('reloadArea');
        }
      }, this));
    },
    
    _confirmThreadRemoval: function (confirmCallback) {
      renderDustTemplate('discussion/discussion-confirm-thread-removal.dust', {}, $.proxy(function(text) {
        var dialog = $(text);
        $(text).dialog({
          modal : true,
          resizable : false,
          width : 360,
          dialogClass : "discussion-management-dialog",
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

    _onMessageReplyClick: function (event) {
      var messageElement = $(event.target)
        .closest('.di-message');
      
      var areaId = messageElement.attr('data-area-id');
      var threadId = messageElement.attr('data-id');
      
      this.element.closest('.discussion').discussion('replyMessageDialog', {
        areaId: areaId,
        threadId: threadId
      });
    },
    
    _onMessageQuoteClick: function (event) {
      var messageElement = $(event.target)
        .closest('.di-message');
      
      var areaId = messageElement.attr('data-area-id');
      var threadId = messageElement.attr('data-id');
      var quote = $('<pre>').append($('<blockquote>').html(messageElement.find('.mf-item-content-text').html())).html();

      this.element.closest('.discussion').discussion('replyMessageDialog', {
        areaId: areaId,
        threadId: threadId,
        content: quote
      });
    },
    
    _onMessageEditClick: function (event) {
      var messageElement = $(event.target)
        .closest('.di-message');
      
      var areaId = messageElement.attr('data-area-id');
      var threadId = messageElement.attr('data-id');

      this.element.closest('.discussion').discussion('editMessageDialog', {
        areaId: areaId,
        threadId: threadId
      });
    },
    
    _onReplyEditClick: function (event) {
      var messageElement = $(event.target)
        .closest('.di-message');
      var repliesElement = $(event.target)
        .closest('.di-replies-container');
      
      var areaId = repliesElement.attr('data-area-id');
      var threadId = repliesElement.attr('data-thread-id');
      var replyId = messageElement.attr('data-id');

      this.element.closest('.discussion').discussion('editReplyDialog', {
        areaId: areaId,
        threadId: threadId,
        replyId: replyId
      });
    },
    
    _onReplyAnswerClick: function (event) {
      var messageElement = $(event.target)
        .closest('.di-message');
      var repliesElement = $(event.target)
        .closest('.di-replies-container');
      
      var areaId = repliesElement.attr('data-area-id');
      var threadId = repliesElement.attr('data-thread-id');
      var parentReplyId = $(messageElement).attr("data-parent-id") ? $(messageElement).attr("data-parent-id") : $(messageElement).attr("data-id");
      
      this.element.closest('.discussion').discussion('replyMessageDialog', {
        areaId: areaId,
        threadId: threadId,
        parentReplyId: parentReplyId
      });
    },
    
    _onReplyQuoteClick: function (event) {
       var replyElement = $(event.target)
        .closest('.di-reply');
       var repliesElement = $(event.target)
         .closest('.di-replies-container');
       
      var areaId = repliesElement.attr('data-area-id');
      var threadId = repliesElement.attr('data-thread-id');
      var parentReplyId = $(replyElement).attr("data-parent-id") ? $(replyElement).attr("data-parent-id") : $(replyElement).attr("data-id");
      var quote = $('<pre>').append($('<blockquote>').html(replyElement.find('.mf-item-content-text').html())).html();
      
      this.element.closest('.discussion').discussion('replyMessageDialog', {
        areaId: areaId,
        threadId: threadId,
        parentReplyId: parentReplyId,
        content: quote
      });
    },
    
    _onBackClick: function (event) {
      this.element.closest('.discussion').discussion('reloadArea');
    },
    
    _onRemoveClick: function (event) {
      this._confirmThreadRemoval($.proxy(function () {
        this._removeThread();
      }, this));
    },
    
    _onMoreRepliesClickClick: function (event) {
      this._loadMoreReplies();
    }
  
  });
  
  $.widget("custom.discussionThreads", {
    
    options: {
      maxThreadCount: 25
    },
    
    _create : function() {
      this._firstResults = 0;
      this._threads = [];
      
      this.element.on("click", ".di-page-link-load-more-messages", $.proxy(this._onLoadMoreClick, this));
      this.element.on("click", ".di-message-meta-topic", $.proxy(this._onMessageTopicClick, this));
    },
    
    loadThreads: function (areaId) {
      this._areaId = areaId;
      this._reloadThreads();
    },
    
    _loadMoreThreads: function () {
      this._firstResults += this.options.maxThreadCount;
      this._loadThreads(this._areaId);
    },
    
    _reloadThreads: function () {
      this._firstResults = 0;
      this._threads = [];
      this._loadThreads(this._areaId);
    },
    
    _loadThreads: function (areaId) {
      this.element
        .text('')
        .addClass('loading');
      
      this.options.ioController.loadThreads(areaId, this._firstResults, this.options.maxThreadCount + 1, $.proxy(function (err, response) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var threads = _.clone(response);
          
          var hasMore = false;
          if (threads.length > this.options.maxThreadCount) {
            hasMore = true;
            threads.pop();
          }
          
          this._threads = this._threads.concat(threads);
          
          renderDustTemplate('/discussion/discussion_items.dust', { 
            threads: this._threads, 
            hasMore: hasMore 
          }, $.proxy(function(text) {
            this.element
              .html(text)
              .removeClass('loading');
          }, this))
        }
      }, this));
    },
    
    _onLoadMoreClick: function (event) {
      this._loadMoreThreads();
    },
    
    _onMessageTopicClick: function (event) {
      var areaId = $(event.target).closest('.di-message')
        .attr('data-area-id');
      var threadId = $(event.target).closest('.di-message')
        .attr('data-id');
      
      this.element
        .closest('.discussion')
        .discussion('loadThread', areaId, threadId);
    }
  });
  
  $.widget("custom.discussionNewAreaDialog", {
    _create : function() {
      this.element.on('click', "input[name='send']", $.proxy(this._onSendClick, this));
      this.element.on('click', "input[name='cancel']", $.proxy(this._onCancelClick, this));
      
      this._load($.proxy(function () {
        
      }, this));
    },
    
    _load: function (callback) {
      var data = {};
      renderDustTemplate('/discussion/discussion_create_area.dust', data, $.proxy(function (text) {
        this.element.html(text);
        
        if (callback) {
          callback();
        }
      }, this));
    },
    
    _onSendClick: function (event) {
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        this.options.ioController.createArea(this.element.find('input[name="name"]').val(), $.proxy(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.newarea', err));
          } else {        
            $('.discussion').discussion('reloadAreas');
          }
          
          this.element.remove();
        }, this));
      }
    },

    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    }
  });
  
  $.widget("custom.discussionEditAreaDialog", {
    _create : function() {
      this.element.on('click', "input[name='send']", $.proxy(this._onSendClick, this));
      this.element.on('click', "input[name='cancel']", $.proxy(this._onCancelClick, this));
      this.element.on('change', "select[name='forumAreaId']", $.proxy(this._onAreaChange, this));
      
      this._load($.proxy(function () {
        
      }, this));
    },
    
    _load: function (callback) {
      this.options.ioController.loadAreas($.proxy(function(err, areas) {
          renderDustTemplate('/discussion/discussion_edit_area.dust', areas, $.proxy(function (text) {
            this.element.html(text);
            
            if (this.options.areaId && this.options.areaId != 'all') {
              var areaSelect = this.element.find("select[name='forumAreaId']");
              areaSelect.val(this.options.areaId)
              this.element.find('input[name="name"]').val(areaSelect.find(':selected').text());
            }
            
            if (callback) {
              callback();
            }
          }, this));
        }, this));
    },
    
    _onSendClick: function (event) {
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        var areaId = this.element.find("select[name='forumAreaId']").val();
        var name = this.element.find('input[name="name"]').val();
        
        this.options.ioController.updateArea(areaId, name, $.proxy(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.newarea', err));
          } else {
            $('.discussion').discussion('reloadAreas');
          }
          
          this.element.remove();
        }, this));
      }
    },

    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    },
    
    _onAreaChange: function (event) {
      this.element.find('input[name="name"]').val($(event.target).find(':selected').text());
    }
  });
  
  $.widget("custom.discussionDeleteAreaDialog", {
    _create : function() {
      this.element.on('click', "input[name='send']", $.proxy(this._onSendClick, this));
      this.element.on('click', "input[name='cancel']", $.proxy(this._onCancelClick, this));
      this._load($.proxy(function () {
        
      }, this));
    },
    
    _load: function (callback) {
      this.options.ioController.loadAreas($.proxy(function(err, areas) {
        renderDustTemplate('/discussion/discussion_delete_area.dust', areas, $.proxy(function (text) {
          this.element.html(text);
          
          if (this.options.areaId && this.options.areaId != 'all') {
            this.element.find("select[name='forumAreaId']")
              .val(this.options.areaId)
          }
          
          if (callback) {
            callback();
          }
        }, this));
      }, this));
    },
    
    _onSendClick: function (event) {
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        var areaId = this.element.find("select[name='forumAreaId']").val();
        this.options.ioController.deleteArea(areaId, $.proxy(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            $('.discussion').discussion('reloadAreas');
          }
          
          this.element.remove();
        }, this));
      }
    },

    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    },
    
    _onAreaChange: function (event) {
      this.element.find('input[name="name"]').val($(event.target).find(':selected').text());
    }
  });
  
  $.widget("custom.discussionAbstractMessageDialog", {
    
    options: {
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
          'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.9/',
          'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.1/plugin.min.js',
          'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.2/plugin.min.js'
        }
      }
    },
    
    _create: function () {
      var extraPlugins = [];
      
      $.each($.extend(this.options.ckeditor.extraPlugins, {}, true), $.proxy(function (plugin, url) {
        CKEDITOR.plugins.addExternal(plugin, url);
        extraPlugins.push(plugin);
      }, this));
    
      this.options.ckeditor.extraPlugins = extraPlugins.join(',');
    },
    
    _destroy: function () {
      this.destroyEditor();
    },
    
    destroyEditor: function (discardDraft) {
      try {
        if (this._messageEditor) {
          this._messageEditor.pauseDrafting();
          
          if (discardDraft) {
            this._messageEditor.discardDraft();
          }
          
          this._messageEditor.destroy();
          this._messageEditor = null;
        }
      } catch (e) {
      }
    }
    
  });
  
  $.widget("custom.discussionNewMessageDialog", $.custom.discussionAbstractMessageDialog, {
    
    _create : function() {
      this._superApply( arguments );
      
      this.element.on('click', "input[name='send']", $.proxy(this._onSendClick, this));
      this.element.on('click', "input[name='cancel']", $.proxy(this._onCancelClick, this));
      
      this._load($.proxy(function () {
        
      }, this));
    },
    
    _destroy: function () {
      try {
        this._messageEditor.destroy();
      } catch (e) {
        
      }
    },
    
    _load: function (callback) {
      var tasks = [this._createAreasLoad()];
      
      async.parallel(tasks, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var areas = results[0];
          
          renderDustTemplate('/discussion/discussion_create_message.dust', areas, $.proxy(function (text) {
            this.element.html(text);
            
            if (this.options.areaId) {
              this.element.find('*[name="forumAreaId"]').val(this.options.areaId);
            }
            
            this._messageEditor = CKEDITOR.replace(this.element.find('textarea[name="message"]')[0], $.extend(this.options.ckeditor, {
              draftKey: 'discussion-new-message',
              on: {
                instanceReady: $.proxy(this._onCKEditorReady, this)
              }
            }));
            
            if (callback) {
              callback();
            }
          }, this));
        }
      }, this));
    },
    
    _createAreasLoad: function () {
      return $.proxy(function (callback) {
        this.options.ioController.loadAreas(callback);
      }, this);
    },
    
    _onCKEditorReady: function (event) {
      this.element.find('input[name="send"]').removeAttr('disabled'); 
    },
    
    _onSendClick: function (event) {
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        var forumAreaId = this.element.find('*[name="forumAreaId"]').val();
        
        var title = this.element.find('*[name="title"]').val();
        if (!title && !title.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.notitle'));
          return;
        }
        
        var message = this._messageEditor.getData();
        if (!message || !message.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nomessage'));
          return;
        }

        var sticky = this.element.find('*[name="sticky"]').val() == 'true';
        var locked = this.element.find('*[name="locked"]').val() == 'true';
        
        this.options.ioController.createThread(forumAreaId, title, message, sticky, locked, $.proxy(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.newmessage'));
            $('.discussion').discussion('reloadArea');
            this.element.remove();
          }
        }, this));
      }
    },

    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    }
  });
  
  $.widget("custom.discussionReplyMessageDialog", $.custom.discussionAbstractMessageDialog, {
    
    _create : function() {
      this._superApply( arguments );
      
      this.element.on('click', "input[name='send']", $.proxy(this._onSendClick, this));
      this.element.on('click', "input[name='cancel']", $.proxy(this._onCancelClick, this));
      
      this._load($.proxy(function () {
        
      }, this));
    },
    
    _destroy: function () {
      try {
        this._messageEditor.destroy();
      } catch (e) {
        
      }
    },
    
    _createThreadLoad: function (areaId, threadId) {
      return $.proxy(function (callback) {
        this.options.ioController.loadThread(areaId, threadId, callback);
      }, this);
    },
    
    _createAreaLoad: function (areaId) {
      return $.proxy(function (callback) {
        this.options.ioController.loadArea(areaId, callback);
      }, this);
    },
    
    _load: function (callback) {
      var tasks = [this._createThreadLoad(this.options.areaId, this.options.threadId), this._createAreaLoad(this.options.areaId)];
      
      async.parallel(tasks, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var area = results[1];
          var reply = $.extend(results[0], {
            areaName: area.name
          });
          
          renderDustTemplate('/discussion/discussion_create_reply.dust', reply, $.proxy(function (text) {
            this.element.html(text);
            if (this.options.content) {
              this.element.find('*[name="message"]').val(this.options.content);
            }
            
            this._messageEditor = CKEDITOR.replace(this.element.find('textarea[name="message"]')[0], $.extend(this.options.ckeditor, {
              draftKey: 'discussion-reply-message-' + this.options.areaId + '-' + this.options.threadId,
              on: {
                instanceReady: $.proxy(this._onCKEditorReady, this)
              }
            }));
            
            if (callback) {
              callback();
            }
          }, this));
        }
      }, this));
    },
    
    _onCKEditorReady: function (event) {
      this.element.find('input[name="send"]').removeAttr('disabled'); 
    },
    
    _onSendClick: function (event) {
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        var message = this._messageEditor.getData();
        if (!message || !message.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nomessage'));
          return;
        }
        
        this.options.ioController.createThreadReply(this.options.areaId, this.options.threadId, this.options.parentReplyId, message, $.proxy(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            this.destroyEditor(true);
            $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.newreply'));
            $('.discussion').discussion('reloadThread');
            this.element.remove();
          }
        },this));
      }
    },

    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    }
  });
  
  $.widget("custom.discussionEditMessageDialog", $.custom.discussionAbstractMessageDialog, {
    
    _create : function() {
      this._superApply( arguments );
      
      this.element.on('click', "input[name='send']", $.proxy(this._onSendClick, this));
      this.element.on('click', "input[name='cancel']", $.proxy(this._onCancelClick, this));
      
      this._load($.proxy(function () {
        
      }, this));
    },
    
    _destroy: function () {
      try {
        this._messageEditor.destroy();
      } catch (e) {
      }
    },
    
    _load: function (callback) {
      this.options.ioController.loadThread(this.options.areaId, this.options.threadId, $.proxy(function (err, thread) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          renderDustTemplate('/discussion/discussion_edit_message.dust', thread, $.proxy(function (text) {
            this.element.html(text);
            this._messageEditor = CKEDITOR.replace(this.element.find('textarea[name="message"]')[0], $.extend(this.options.ckeditor, {
              draftKey: 'discussion-edit-message-' + this.options.areaId + '-' + this.options.threadId,
              on: {
                instanceReady: $.proxy(this._onCKEditorReady, this)
              }
            }));
            
            if (callback) {
              callback();
            }
          }, this));
        }
      }, this));
    },
    
    _onCKEditorReady: function (event) {
      this.element.find('input[name="send"]').removeAttr('disabled'); 
    },
    
    _onSendClick: function (event) {
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        var title = this.element.find('*[name="title"]').val();
        if (!title && !title.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.notitle'));
          return;
        }
        
        var message = this._messageEditor.getData();
        if (!message || !message.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nomessage'));
          return;
        }
        
        this.options.ioController.updateThread(this.options.areaId, this.options.threadId, title, message, $.proxy(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            this.destroyEditor(true);
            $('.discussion').discussion('reloadThread');
            this.element.remove();
          }
        }, this));
      }
    },

    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    }
  });
  
  $.widget("custom.discussionEditReplyDialog", $.custom.discussionAbstractMessageDialog, {
    
    _create : function() {
      this._superApply( arguments );
      
      this.element.on('click', "input[name='send']", $.proxy(this._onSendClick, this));
      this.element.on('click', "input[name='cancel']", $.proxy(this._onCancelClick, this));
      
      this._load($.proxy(function () {
        
      }, this));
    },
    
    _destroy: function () {
      try {
        this._messageEditor.destroy();
      } catch (e) {
      }
    },
    
    _load: function (callback) {
      this.options.ioController.loadThreadReply(this.options.areaId, this.options.threadId, this.options.replyId, $.proxy(function (err, reply) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          renderDustTemplate('/discussion/discussion_edit_reply.dust', reply, $.proxy(function (text) {
            this.element.html(text);
            this._messageEditor = CKEDITOR.replace(this.element.find('textarea[name="message"]')[0], $.extend(this.options.ckeditor, {
              draftKey: 'discussion-reply-message-' + this.options.areaId + '-' + this.options.threadId + '-' +  this.options.replyId,
              on: {
                instanceReady: $.proxy(this._onCKEditorReady, this)
              }
            }));
            
            if (callback) {
              callback();
            }
          }, this));
        }
      }, this));
    },
    
    _onCKEditorReady: function (event) {
      this.element.find('input[name="send"]').removeAttr('disabled'); 
    },
    
    _onSendClick: function (event) {
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        var message = this._messageEditor.getData();
        if (!message || !message.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nomessage'));
          return;
        }
        
        this.options.ioController.updateThreadReply(this.options.areaId, this.options.threadId, this.options.replyId, message, $.proxy(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            this.destroyEditor(true);
            $('.discussion').discussion('reloadThread');
            this.element.remove();
          }
        }, this));
      }
    },

    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    }
  });

}).call(this);