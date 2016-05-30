(function() {
  'use strict';
  
  $.widget("custom.discussion", {
    
    _create : function() {
      this._areaId = null;
      
      this.element.on("change", "#discussionAreaSelect", $.proxy(this._onAreaSelectChange, this));
      this.element.on("click", ".di-new-area-button", $.proxy(this._onNewAreaClick, this));
      this.element.on("click", ".di-new-message-button", $.proxy(this._onNewMessageClick, this));
      this.element.on("click", ".di-edit-area-button", $.proxy(this._onEditMessageClick, this));
      this.element.on("click", ".di-delete-area-button", $.proxy(this._onDeleteMessageClick, this));

      this.element.find('.di-threads')
        .show()
        .discussionThreads();
      
      this.element.find('.di-thread')
        .hide()
        .discussionThread();
      
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
      this.element.find("#discussionAreaSelect").val('all');
      this._loadThreads('all');
    },
    
    loadArea: function (areaId) {
      this._threadId = null;
      this._areaId = areaId;
      this._allAreas = false;
      this._updateHash();
      this.element.find("#discussionAreaSelect").val(areaId);
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
      var tasks = [this._createAreaLoad()];
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
        this.element.find("#discussionAreaSelect").val('all');      
      } else {
        this.element.find("#discussionAreaSelect").val(areaId);
      }
      
      this._loadThread(areaId, threadId);
    },
    
    reloadThread: function () {
      this.loadThread(this._areaId, this._threadId);
    },
        
    newAreaDialog: function () {
      var dialog = $('<div>')
        .discussionNewAreaDialog();
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
        
    editAreaDialog: function (areaId) {
      var dialog = $('<div>')
        .discussionEditAreaDialog({
          areaId: areaId
        });
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
        
    deleteAreaDialog: function (areaId) {
      var dialog = $('<div>')
        .discussionDeleteAreaDialog({
          areaId: areaId
        });
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
    
    newMessageDialog: function (options) {
      var dialog = $('<div>')
        .discussionNewMessageDialog(options||{});
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
    
    replyMessageDialog: function (options) {
      var dialog = $('<div>')
        .discussionReplyMessageDialog(options||{});
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
    
    editMessageDialog: function (options) {
      var dialog = $('<div>')
        .discussionEditMessageDialog(options||{});
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
    
    editReplyDialog: function (options) {
      var dialog = $('<div>')
        .discussionEditReplyDialog(options||{});
      
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
      var tasks = [this._createAreaLoad()];
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
    
    _createAreaLoad: function () {
      return $.proxy(function (callback) {
        mApi().forum.areas
          .read()
          .callback(callback);
      }, this);
    },
    
    _buildAreaSelect: function (areas) {
      var areaSelect = $(this.element)
        .find("#discussionAreaSelect")
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
        mApi().forum.areas.threads
          .read(areaId, threadId)
          .callback(callback);
      }, this);
    },
    
    _createThreadRepliesLoad: function (areaId, threadId) {
      var replyCreatedMap = {};
      
      return $.proxy(function (callback) {
        mApi().forum.areas.threads.replies
          .read(areaId, threadId, {
            firstResult: this._firstResult,
            maxResults: this.options.maxReplyCount + 1
          })
          .on('$', $.proxy(function(reply, replyCallback) {
            mApi().user.users.basicinfo
              .read(reply.creator)
              .callback($.proxy(function(err, user) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification', 'error', err);
                } else {
                  // TODO: remove pretty dates
                  var d = new Date(reply.created);
                  var ld = new Date(reply.lastModified);
                  replyCreatedMap[reply.id] = d;
                  
                  reply.creatorFullName = user.firstName + ' ' + user.lastName;
                  reply.isEdited = reply.lastModified == reply.created ? false : true;            
                  reply.canEdit = reply.creator === MUIKKU_LOGGED_USER_ID ? true : false;
                  reply.prettyDate = formatDate(d) + ' ' + formatTime(d);
                  reply.prettyDateModified = formatDate(ld) + ' ' + formatTime(ld);                    
                  reply.threadId = threadId;
                  reply.userRandomNo = (user.id % 6) + 1;
                  reply.nameLetter = user.firstName.substring(0,1);
                  reply.isReply = reply.parentReplyId ? true : false;
                  
                  if (reply.isReply){
                    reply.replyParentTime = formatDate(replyCreatedMap[reply.parentReplyId]) + ' ' + formatTime(replyCreatedMap[reply.parentReplyId]);
                  }
                  
                  replyCallback();
                }
              }, this))
            },this))
            .callback(callback);
        
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
          var thread = results[0];
          var replies = _.clone(results[1]||[]);

          mApi().user.users.basicinfo
            .read(thread.creator)
            .callback($.proxy(function(userErr, user) {
              if (userErr) {
                $('.notification-queue').notificationQueue('notification', 'error', userErr);
              } else {
                var d = new Date(thread.created);
                var ld = new Date(thread.lastModified);          
                this._thread = $.extend({
                  creatorFullName: user.firstName + ' ' + user.lastName,
                  isEdited: thread.lastModified == thread.created ? false : true,
                  prettyDate: formatDate(d) + ' ' + formatTime(d),
                  prettyDateModified: formatDate(ld) + ' ' + formatTime(ld),
                  canEdit: thread.creator === MUIKKU_LOGGED_USER_ID ? true : false,
                  userRandomNo: (user.id % 6) + 1,
                  nameLetter: user.firstName.substring(0,1)
                }, thread);
                
                var hasMore = false;
                if (replies.length > this.options.maxReplyCount) {
                  hasMore = true;
                  replies.pop();
                }
                
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
        mayRemoveThread : this.element.closest('#discussion').discussion('mayRemoveThread', this._areaId)
      }, $.proxy(function(text) {
        this.element
          .html(text)
          .removeClass('loading');
      }, this));
    },
    
    _removeThread: function () {
      mApi().forum.areas.threads
        .del(this._areaId, this._threadId)
        .callback($.proxy(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.threadremoved'));
            $('#discussion').discussion('reloadArea');
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
      
      this.element.closest('#discussion').discussion('replyMessageDialog', {
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

      this.element.closest('#discussion').discussion('replyMessageDialog', {
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

      this.element.closest('#discussion').discussion('editMessageDialog', {
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

      this.element.closest('#discussion').discussion('editReplyDialog', {
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
      
      this.element.closest('#discussion').discussion('replyMessageDialog', {
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
      
      this.element.closest('#discussion').discussion('replyMessageDialog', {
        areaId: areaId,
        threadId: threadId,
        parentReplyId: parentReplyId,
        content: quote
      });
    },
    
    _onBackClick: function (event) {
      this.element.closest('#discussion').discussion('reloadArea');
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
      
      var parameters = {
        firstResult: this._firstResults,
        maxResults: this.options.maxThreadCount + 1
      };
        
      var request = areaId == 'all' ? mApi().forum.latest.read(parameters) : mApi().forum.areas.threads.read(areaId, parameters);
      
      request
        .on('$', $.proxy(function(message, messageCallback) {
          this._loadThreadDetails(message, function (err, details) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              message = $.extend(message, details);
              messageCallback();
            }
          });
        }, this))
        .callback($.proxy(function(err, response) {
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
    
    _loadArea: function (forumAreaId, callback) {
      mApi().forum.areas
        .read(forumAreaId)
        .callback(callback);
    },
    
    _loadUserInfo: function (userEntityId, callback) {
      mApi().user.users.basicinfo
        .read(userEntityId)
        .callback(callback);
    },
    
    _createLoadArea: function (forumAreaId) {
      return $.proxy(function (callback) {
        this._loadArea(forumAreaId, callback);
      }, this);
    },
    
    _createUserInfoLoad: function (userEntityId) {
      return $.proxy(function (callback) {
        this._loadUserInfo(userEntityId, callback);
      }, this);
    },
    
    _loadThreadDetails: function(message, callback) {
      var tasks = [this._createUserInfoLoad(message.creator), this._createLoadArea(message.forumAreaId)];
      
      async.parallel(tasks, function (err, results) {
        if (err) {
          callback(err);
        } else {
          var user = results[0];
          var area = results[1];
          var d = new Date(message.created);
          var ud = new Date(message.updated);          
          // TODO: remove prettyDates...
          callback(null, {
            areaName: area.name,
            creatorFullName: user.firstName + ' ' + user.lastName,
            prettyDate: formatDate(d) + ' ' + formatTime(d),
            prettyDateUpdated: formatDate(ud) + ' ' + formatTime(ud),
            userRandomNo: (user.id % 6) + 1,
            nameLetter: user.firstName.substring(0,1)
          });
        }
      });
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
        .closest('#discussion')
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
        mApi().forum.areas
          .create({
            name: this.element.find('input[name="name"]').val()
          })
          .callback($.proxy(function(err, result) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.newarea', err));
            } else {        
              $('#discussion').discussion('reloadAreas');
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
      mApi().forum.areas
        .read()
        .callback($.proxy(function(err, areas) {
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
        
        mApi().forum.areas
          .update(areaId, {
            name: this.element.find('input[name="name"]').val()
          })
          .callback($.proxy(function(err, result) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.newarea', err));
            } else {
              $('#discussion').discussion('reloadAreas');
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
      mApi().forum.areas
        .read()
        .callback($.proxy(function(err, areas) {
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
        
        mApi().forum.areas
          .del(areaId)
          .callback($.proxy(function(err, result) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              $('#discussion').discussion('reloadAreas');
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
        mApi().forum.areas
          .read()
          .callback(callback);
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

        var payload = {
          title: title,
          message: message,
          forumAreaId: forumAreaId,
          sticky: sticky,
          locked: locked
        };
        
        mApi().forum.areas.threads
          .create(forumAreaId, payload)
          .callback($.proxy(function(err, result) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.newmessage'));
              $('#discussion').discussion('reloadArea');
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
        mApi().forum.areas.threads
          .read(areaId, threadId)
          .callback(callback);
      }, this);
    },
    
    _createAreaLoad: function (areaId) {
      return $.proxy(function (callback) {
        mApi().forum.areas
          .read(areaId)
          .callback(callback);
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
        
        var payload = {
          message: message
        };
        
        if (this.options.parentReplyId) {
          payload.parentReplyId = this.options.parentReplyId;
        }
        
        mApi().forum.areas.threads.replies
          .create(this.options.areaId, this.options.threadId, payload)
          .callback($.proxy(function(err, result) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              this.destroyEditor(true);
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.newreply'));
              $('#discussion').discussion('reloadThread');
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
      var tasks = [this._createThreadLoad(this.options.areaId, this.options.threadId)];
      
      async.parallel(tasks, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var thread = results[0];
          
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
    
    _createThreadLoad: function (areaId, threadId) {
      return $.proxy(function (callback) {
        mApi().forum.areas.threads
          .read(areaId, threadId)
          .callback(callback);
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
        
        mApi().forum.areas.threads
          .read(this.options.areaId, this.options.threadId)
          .callback($.proxy(function(getErr, thread) {
            if (getErr) {
              $('.notification-queue').notificationQueue('notification', 'error', getErr);
            } else {
              thread = $.extend(thread, {
                title: title,
                message: message
              });
              
              mApi().forum.areas.threads
                .update(this.options.areaId, this.options.threadId, thread)
                .callback($.proxy(function(err, result) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  } else {
                    this.destroyEditor(true);
                    $('#discussion').discussion('reloadThread');
                    this.element.remove();
                  }
                }, this));   
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
      var tasks = [this._createReplyLoad(this.options.areaId, this.options.threadId, this.options.replyId)];
      
      async.parallel(tasks, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var reply = results[0];
          
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
    
    _createReplyLoad: function (areaId, threadId, replyId) {
      return $.proxy(function (callback) {
        mApi().forum.areas.threads.replies
          .read(areaId, threadId, replyId)
          .callback(callback);
      }, this);
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
        
        mApi().forum.areas.threads.replies
          .read(this.options.areaId, this.options.threadId, this.options.replyId)
          .callback($.proxy(function(getErr, reply) {
            if (getErr) {
              $('.notification-queue').notificationQueue('notification', 'error', getErr);
            } else {
              reply = $.extend(reply, {
                message: message
              });
              
              mApi().forum.areas.threads.replies
                .update(this.options.areaId, this.options.threadId, this.options.replyId, reply)
                .callback($.proxy(function(err, result) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  } else {
                    this.destroyEditor(true);
                    $('#discussion').discussion('reloadThread');
                    this.element.remove();
                  }
                }, this));   
            }
          }, this));
      }
    },

    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    }
  });
  
  $(document).ready(function() {
    $('#discussion').discussion({
      areaPermissions: $.parseJSON($('input[name="areaPermissions"]').val())
    });
    
    webshim.polyfill('forms');
  });

}).call(this);