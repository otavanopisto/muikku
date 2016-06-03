(function() {
  'use strict';

  var EnvironmentDiscussionIOController = function (options) {
    this._super = DiscussionIOController.prototype;
    DiscussionIOController.call(this, arguments); 
  };
  
  $.extend(EnvironmentDiscussionIOController.prototype, DiscussionIOController.prototype, {
    
    createArea: function (name, callback) {
      mApi().forum.areas
        .create({
          name: name
        })
        .callback(callback);
    },
    
    loadArea: function (areaId, callback) {
      mApi().forum.areas
        .read(areaId)
        .callback(callback);
    },
    
    loadAreas: function (callback) {
      mApi().forum.areas
        .read()
        .callback(callback);
    },
    
    updateArea: function (areaId, name, callback) {
      mApi().forum.areas
        .update(areaId, {
          name: name
        })
        .callback(callback);
    },
    
    deleteArea: function (areaId, callback) {
      mApi().forum.areas
        .del(areaId)
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
      
      mApi().forum.areas.threads
        .create(forumAreaId, payload)
        .callback(callback);
    },
    
    loadThread: function (areaId, threadId, callback) {
      mApi().forum.areas.threads
        .read(areaId, threadId)
        .callback(callback);
    },
    
    loadThreads: function (areaId, firstResult, maxResults, callback) {
      var parameters = {
        firstResult: firstResult,
        maxResults: maxResults
      };
        
      var request = areaId == 'all' ? mApi().forum.latest.read(parameters) : mApi().forum.areas.threads.read(areaId, parameters);
      
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
    
    updateThread: function (areaId, threadId, title, message, callback) {
      mApi().forum.areas.threads
        .read(areaId, threadId)
        .callback($.proxy(function(getErr, thread) {
          if (getErr) {
            callback(getErr);
          } else {
            thread = $.extend(thread, {
              title: title,
              message: message
            });
            
            mApi().forum.areas.threads
              .update(areaId, threadId, thread)
              .callback(callback);   
          }
        }, this));
    },
    
    deleteThread: function (areaId, threadId, callback) {
      mApi().forum.areas.threads
        .del(areaId, threadId)
        .callback(callback);
    },
    
    createThreadReply: function (areaId, threadId, parentReplyId, message, callback) {
      var payload = {
        message: message
      };
      
      if (parentReplyId) {
        payload.parentReplyId = parentReplyId;
      }
      
      mApi().forum.areas.threads.replies
        .create(areaId, threadId, payload)
        .callback(callback);
    },
    
    loadThreadReplies: function (areaId, threadId, firstResult, maxResults, callback) {
      mApi().forum.areas.threads.replies
        .read(areaId, threadId, {
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
      mApi().forum.areas.threads.replies
        .read(areaId, threadId, replyId)
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
          
          mApi().forum.areas.threads.replies
            .update(areaId, threadId, replyId, reply)
            .callback(callback);
        }
      }, this));
    }
    
  });
  
  $(document).ready(function() {
    $('#discussion').discussion({
      areaPermissions: $.parseJSON($('input[name="areaPermissions"]').val()),
      ioController: new EnvironmentDiscussionIOController()
    });
    
    webshim.polyfill('forms');
  });

}).call(this);