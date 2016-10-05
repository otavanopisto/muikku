(function() {
  'use strict';
  
  var WorkspaceDiscussionIOController = function (options) {
    this._super = DiscussionIOController.prototype;
    DiscussionIOController.apply(this, arguments); 
  };
  
  $.extend(WorkspaceDiscussionIOController.prototype, DiscussionIOController.prototype, {

    createArea: function (name, callback) {
      mApi().workspace.workspaces.forumAreas
        .create(this.options.workspaceEntityId, {
          name: name
        })
        .callback(callback);
    },
    
    loadArea: function (areaId, callback) {
      mApi().workspace.workspaces.forumAreas
        .read(this.options.workspaceEntityId, areaId)
        .callback(callback);
    },
    
    loadAreas: function (callback) {
      mApi().workspace.workspaces.forumAreas
        .read(this.options.workspaceEntityId)
        .callback(callback);
    },
    
    updateArea: function (areaId, name, callback) {
      mApi().workspace.workspaces.forumAreas
        .update(this.options.workspaceEntityId, areaId, {
          name: name
        })
        .callback(callback);
    },
    
    deleteArea: function (areaId, callback) {
      mApi().workspace.workspaces.forumAreas
        .del(this.options.workspaceEntityId, areaId)
        .callback(callback);
    },
    
    createThread: function (forumAreaId, title, message, sticky, locked, callback) {
      var payload = {
        title: title,
        message: message,
        forumAreaId: forumAreaId,
        sticky: sticky,
        locked: locked
      };
      
      mApi().workspace.workspaces.forumAreas.threads
        .create(this.options.workspaceEntityId, forumAreaId, payload)
        .callback(callback);
    },
    
    loadThread: function (areaId, threadId, callback) {
      mApi().workspace.workspaces.forumAreas.threads
        .read(this.options.workspaceEntityId, areaId, threadId)
        .callback(callback);
    },
    
    loadThreads: function (areaId, firstResult, maxResults, callback) {
      var parameters = {
        firstResult: firstResult,
        maxResults: maxResults
      };
        
      var request = areaId == 'all' ? mApi().workspace.workspaces.forumLatest.read(this.options.workspaceEntityId, parameters) : mApi().workspace.workspaces.forumAreas.threads.read(this.options.workspaceEntityId, areaId, parameters);
      
      request
        .on('$', $.proxy(function(thread, threadCallback) {
          this.loadThreadDetails(thread, function (err, details) {
            if (err) {
              callback(err);
              return;
            } else {
              thread = $.extend(thread, details);
              threadCallback();
            }
          });
        }, this))
        .callback(callback);
    },
    
    updateThread: function (areaId, threadId, title, message, sticky, locked, callback) {
      mApi().workspace.workspaces.forumAreas.threads
        .read(this.options.workspaceEntityId, areaId, threadId)
        .callback($.proxy(function(getErr, thread) {
          if (getErr) {
            callback(getErr);
          } else {
            thread = $.extend(thread, {
              title: title,
              message: message,
              sticky: sticky,
              locked: locked
            });
            
            mApi().workspace.workspaces.forumAreas.threads
              .update(this.options.workspaceEntityId, areaId, threadId, thread)
              .callback(callback);   
          }
        }, this));
    },
    
    deleteThread: function (areaId, threadId, callback) {
      mApi().workspace.workspaces.forumAreas.threads
        .del(this.options.workspaceEntityId, areaId, threadId)
        .callback(callback);
    },
    
    createThreadReply: function (areaId, threadId, parentReplyId, message, callback) {
      var payload = {
        message: message
      };
      
      if (parentReplyId) {
        payload.parentReplyId = parentReplyId;
      }
      
      mApi().workspace.workspaces.forumAreas.threads.replies
        .create(this.options.workspaceEntityId, areaId, threadId, payload)
        .callback(callback);
    },
    
    loadThreadReplies: function (areaId, threadId, firstResult, maxResults, callback) {
      mApi().workspace.workspaces.forumAreas.threads.replies
        .read(this.options.workspaceEntityId, areaId, threadId, {
          firstResult: firstResult,
          maxResults: maxResults
        })
        .callback($.proxy(function (err, replies) {
          if (err) {
            callback(err);
          } else {
            this.loadThreadRepliesDetails(replies, function (detailsErr, details) {
              if (detailsErr) {
                callback(detailsErr);
              } else {
                $.each(details, function (index, detail) {
                  $.extend(replies[index], detail);
                });
                
                callback(null, replies);
              }
            });
          }
        }, this));
    },
    
    loadThreadReply: function (areaId, threadId, replyId, callback) {
      mApi().workspace.workspaces.forumAreas.threads.replies
        .read(this.options.workspaceEntityId, areaId, threadId, replyId)
        .callback(callback);
    },
    
    updateThreadReply: function (areaId, threadId, replyId, message, callback) {
      this.loadThreadReply(areaId, threadId, replyId, $.proxy(function (loadErr, reply) {
        if (loadErr) {
          callback(loadErr);
        } else {
          reply = $.extend(reply, {
            message: message
          });
          
          mApi().workspace.workspaces.forumAreas.threads.replies
            .update(this.options.workspaceEntityId, areaId, threadId, replyId, reply)
            .callback(callback);
        }
      }, this));
    }
  
  });
  
  $(document).ready(function() {
    $('#content').discussion({
      areaPermissions: $.parseJSON($('input[name="areaPermissions"]').val()),
      ioController: new WorkspaceDiscussionIOController({
        workspaceEntityId: $("input[name='workspaceEntityId']").val()
      })
    });
    
    webshim.polyfill('forms');
  });

}).call(this);