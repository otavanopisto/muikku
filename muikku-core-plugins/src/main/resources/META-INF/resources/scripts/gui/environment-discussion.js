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
    
    loadThreadDetails: function(thread, callback) {
      var tasks = [this._createUserInfoLoad(thread.creator), this._createLoadArea(thread.forumAreaId)];
      
      async.parallel(tasks, function (err, results) {
        if (err) {
          callback(err);
        } else {
          var user = results[0];
          var area = results[1];
          var d = new Date(thread.created);
          var ud = new Date(thread.updated);          
          // TODO: remove prettyDates...
          callback(null, $.extend({}, thread, {
            areaName: area.name,
            creatorFullName: user.firstName + ' ' + user.lastName,
            prettyDate: formatDate(d) + ' ' + formatTime(d),
            prettyDateUpdated: formatDate(ud) + ' ' + formatTime(ud),
            prettyDateModified: formatDate(ud) + ' ' + formatTime(ud),
            userRandomNo: (user.id % 6) + 1,
            nameLetter: user.firstName.substring(0,1),
            isEdited: thread.lastModified == thread.created ? false : true,
            canEdit: thread.creator === MUIKKU_LOGGED_USER_ID ? true : false
          }));
        }
      });
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
            $('.notification-queue').notificationQueue('notification', 'error', getErr);
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
      var replyCreatedMap = {};
      
      mApi().forum.areas.threads.replies
        .read(areaId, threadId, {
          firstResult: firstResult,
          maxResults: maxResults
        })
        .on('$', $.proxy(function(reply, replyCallback) {
          this._loadUserInfo(reply.creator, ($.proxy(function(err, user) {
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
          }, this)));
        },this))
        .callback(callback);
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
    },
    
    _loadUserInfo: function (userEntityId, callback) {
      mApi().user.users.basicinfo
        .read(userEntityId)
        .callback(callback);
    },

    _createUserInfoLoad: function (userEntityId) {
      return $.proxy(function (callback) {
        this._loadUserInfo(userEntityId, callback);
      }, this);
    },
    
    _createLoadArea: function (forumAreaId) {
      return $.proxy(function (callback) {
        this.loadArea(forumAreaId, callback);
      }, this);
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