$(document).ready(function() {

  function confirmThreadRemoval(confirmCallback) {
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
            $(this).dialog("close");
            confirmCallback();
          }
        }, {
          'text' : dialog.attr('data-button-cancel-text'),
          'class' : 'cancel-button',
          'click' : function(event) {
            $(this).dialog("close");
          }
        } ]
      });
    }, this));
  }

  DiscImpl = $.klass({

    init : function() {
      // todo: parse url
      
      this.refreshAreas();
      $(DiscImpl.msgContainer).on("click", '.di-message:not(.open) .di-message-meta-topic span', $.proxy(this._onMessageClick, this));
      $(DiscImpl.msgContainer).on("click", '.icon-goback', $.proxy(this._onBackClick, this));
      $(DiscImpl.msgContainer).on("click", '.di-page-link-load-more-messages:not(.disabled)', $.proxy(this._onMoreClick, this));
      $(DiscImpl.msgContainer).on("click", '.di-page-link-load-more-replies:not(.disabled)', $.proxy(this._onMoreRepliesClick, this));
      $(DiscImpl.msgContainer).on("click", '.di-message-reply-link', $.proxy(this.replyThread, this));
      $(DiscImpl.msgContainer).on("click", '.di-remove-thread-link', $.proxy(this._onRemoveThreadClick, this));
      $(window).on("hashchange", $.proxy(this._onHashChange, this));
      $(window).trigger("hashchange");
     
    },

    refreshLatest : function() {
      this.clearMessages(); 
      mApi().forum.latest.read().on('$', function(msgs, msgsCallback) {
        mApi().forum.areas.read(msgs.forumAreaId).callback(function(err, area) {
          msgs.areaName = area.name;

        });
        
        var d = new Date(msgs.created);

        msgs.prettyDate = d.toLocaleString();

        msgsCallback();

      }).callback(function(err, threads) {

        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          
          renderDustTemplate('/discussion/discussion_items.dust', threads, function(text) {

            $(DiscImpl.msgContainer).append($.parseHTML(text));

          });

        }
      });

    },

    refreshAreas : function() {

      mApi().forum.areas.read().callback(function(err, areas) {

        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.selectarea.empty', err));
        } else {

          var select = $("#discussionAreaSelect");

          $(select).empty();

          if (areas && (areas.length != 0)) {
            var allAreas = $("<option value='all'>" + getLocaleText('plugin.discussion.browseareas.all', err) + "</option>");
            allAreas.appendTo(select);
            for (var i = 0; i < areas.length; i++) {
              var name = areas[i].name;
              var id = areas[i].id;
              var groupId = areas[i].groupId;

              if (groupId == null) {
                $("<option value='" + id + "'>" + name + "</option>").appendTo(select);
              }

            }
          } else {
            $("<option>" + getLocaleText('plugin.discussion.selectarea.empty') + "</option>").appendTo(select);

          }

        }
      });

    },

    refreshThread : function(aId, tId) {

      this.clearMessages();

      mApi().forum.areas.threads.read(aId, tId).on('$', function(thread, threadCallback) {
        mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area) {
          thread.areaName = area.name;

        });

        mApi().user.users.basicinfo.read(thread.creator).callback(function(err, user) {
          thread.creatorFullName = user.firstName + ' ' + user.lastName;

        });

        var d = new Date(thread.created);

        thread.prettyDate = d.toLocaleString();

        threadCallback();

      }).callback(function(err, threads) {

        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {

          var areaPermissions = $.parseJSON($('input[name="areaPermissions"]').val());
          var mayRemoveThread = areaPermissions[aId] && areaPermissions[aId].removeThread;

          renderDustTemplate('/discussion/discussion_items_open.dust', {
            threads : threads,
            mayRemoveThread : mayRemoveThread
          }, function(text) {
            $(DiscImpl.msgContainer).append($.parseHTML(text));
          });
        }
      });

      this.loadThreadReplies(aId, tId);
    },

    filterMessagesByArea : function(val) {


      this.clearMessages();
      if (val == 'all') {
        this.refreshLatest();
      } else {
        mApi().forum.areas.threads.read(val).on('$', function(thread, threadCallback) {

          mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area) {
            thread.areaName = area.name;

          });

          mApi().user.users.basicinfo.read(thread.creator).callback(function(err, user) {
            thread.creatorFullName = user.firstName + ' ' + user.lastName;

          });

          var d = new Date(thread.created);

          thread.prettyDate = d.toLocaleString();

          threadCallback();
        }).callback(function(err, threads) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
          } else {


            renderDustTemplate('/discussion/discussion_items.dust', threads, function(text) {

              $(DiscImpl.msgContainer).append($.parseHTML(text));

            });
            
            var loadMoreButton = $(".di-page-link-load-more-messages");
            
            loadMoreButton.attr('data-area-id', val);
          }

        });

      }
    },

    _onMessageClick : function(event){

      var element = $(event.target);
      element = element.parents(".di-message");
      var tId = $(element).attr("id");
      var aId = $(element).find("input[name='areaId']").attr('value');
      
      window.location.hash =  "#thread/" + aId + "/" + tId;
      
    },

    _onBackClick : function(event){
      
      window.location.hash =  '';
      
    },   
    
    _onMoreClick : function(event){
      var element = $(event.target);
      var areaId = element.attr("data-area-id");
      element = element.parents(".di-messages-paging");

      
      
      $(element).remove();
      var msgsCount = 0;
      var msgs = $(DiscImpl.msgContainer).find('.di-message');
      
      for(var m = 0; m < msgs.length; m++){
        msgsCount ++;
       }
        
      var fRes = msgsCount;
      
      if (areaId == undefined){
        mApi().forum.latest.read({'firstResult' : fRes}).on('$', function(msgs, msgsCallback) {
          mApi().forum.areas.read(msgs.forumAreaId).callback(function(err, area) {
            msgs.areaName = area.name;
  
          });
  
  
          
          var d = new Date(msgs.created);
  
          msgs.prettyDate = d.toLocaleString();
  
          msgsCallback();
  
        }).callback(function(err, threads) {
  
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
          } else {
  
            renderDustTemplate('/discussion/discussion_page.dust', threads, function(text) {
  
              $(".di-messages-pages").append($.parseHTML(text));
  
            });
          }
        });     
      
      }else{
        mApi().forum.areas.threads.read(areaId, {'firstResult' : fRes}).on('$', function(thread, threadCallback) {

          mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area) {
            thread.areaName = area.name;

          });

          mApi().user.users.basicinfo.read(thread.creator).callback(function(err, user) {
            thread.creatorFullName = user.firstName + ' ' + user.lastName;

          });

          var d = new Date(thread.created);

          thread.prettyDate = d.toLocaleString();

          threadCallback();
        }).callback(function(err, threads) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
          } else {

            renderDustTemplate('/discussion/discussion_page.dust', threads, function(text) {

              $(".di-messages-pages").append($.parseHTML(text));

            });
          }

        });        
        
      }
    },   
    _onMoreRepliesClick : function(event){
      var element = $(event.target);
      var areaId = element.attr("data-area-id");
      var threadId = element.attr("data-thread-id");
      element = element.parents(".di-replies-paging");

      
      
      $(element).remove();

      
      var pgs = $(DiscImpl.msgContainer).find('.di-replies-page');
      var pgCount = pgs.length;

      var newPg = pgCount + 1;
      
      var pgId = "#page-" + newPg;
       
      var msgsCount = 0;
      var msgs = $(DiscImpl.msgContainer).find('.di-message');
      
      for(var m = 0; m < msgs.length; m++){
        msgsCount ++;
       }
        
      var fRes = msgsCount - 1;
      
      mApi().forum.areas.threads.replies.read(areaId, threadId, {'firstResult' : fRes}).on('$', function(replies, repliesCallback) {

        mApi().forum.areas.read(replies.forumAreaId).callback(function(err, area) {
          replies.areaName = area.name;

        });

        mApi().user.users.basicinfo.read(replies.creator).callback(function(err, user) {
          replies.creatorFullName = user.firstName + ' ' + user.lastName;

        });
        var d = new Date(replies.created);
       
        replies.prettyDate = d.toLocaleString();
        repliesCallback();
      }).callback(function(err, replies) {
        
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noreplies', err));
        } else {
          if(replies){
          replies.pageNo = newPg;
          replies.areaId = areaId;
          replies.threadId = threadId;
          }
          renderDustTemplate('/discussion/discussion_replies_page.dust', replies, function(text) {

            $(".di-replies-container").append($.parseHTML(text));

          });
          
          
        }


      });
      
      // This does not work. TODO : scroll after the elements have loaded.
//      $(pgId).load(function(){
//        this._scrollToElement(pgId);
//        
//      });
    },       
    
    
    _loadThread : function(aId, tId) {


      this.clearMessages();

      mApi().forum.areas.threads.read(aId, tId).on('$', function(thread, threadCallback) {

        mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area) {
          thread.areaName = area.name;

        });

        mApi().user.users.basicinfo.read(thread.creator).callback(function(err, user) {
          thread.creatorFullName = user.firstName + ' ' + user.lastName;

        });

        var d = new Date(thread.created);

        thread.prettyDate = d.toLocaleString();

        threadCallback();
      }).callback(function(err, threads) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          
          var areaPermissions = $.parseJSON($('input[name="areaPermissions"]').val());
          var mayRemoveThread = areaPermissions[aId] && areaPermissions[aId].removeThread;

          renderDustTemplate('/discussion/discussion_items_open.dust', {
            threads : threads,
            mayRemoveThread : mayRemoveThread
          }, function(text) {

            $(DiscImpl.msgContainer).append($.parseHTML(text));

          });
        }

      });

      this.loadThreadReplies(aId, tId);

    },

    loadThreadReplies : function(areaId, threadId) {

      var pageNo = 1;
      
      this.clearReplies();

      mApi().forum.areas.threads.replies.read(areaId, threadId).on('$', function(replies, repliesCallback) {
        


        mApi().forum.areas.read(replies.forumAreaId).callback(function(err, area) {
          replies.areaName = area.name;

        });
 
        
        
        mApi().user.users.basicinfo.read(replies.creator).callback(function(err, user) {
          replies.creatorFullName = user.firstName + ' ' + user.lastName;

        });
        var d = new Date(replies.created);
       
        replies.prettyDate = d.toLocaleString();

        
        repliesCallback();
      }).callback(function(err, replies) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noreplies', err));
        } else {
          replies.areaId = areaId;
          replies.threadId = threadId;
          replies.pageNo = pageNo;
          renderDustTemplate('/discussion/discussion_replies.dust', replies, function(text) {

            $(DiscImpl.msgContainer).append($.parseHTML(text));

          });
          
        }
      });
    },

    _onRemoveThreadClick : function(event) {
      confirmThreadRemoval($.proxy(function() {
        var areaId = $('input[name="areaId"]').val();
        var threadId = $('input[name="threadId"]').val();

        mApi().forum.areas.threads.del(areaId, threadId).callback($.proxy(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            window.location.reload(true);
          }
        }, this));
      }, this));
    },

    replyThread : function(event) {

      var element = $(event.target);
      element = element.parents(".di-message");
      var tId = $(element).attr("id");
      var aId = $(element).find("input[name='areaId']").attr('value');

      var sendReply = function(values) {
        mApi().forum.areas.threads.replies.create(aId, tId, values).callback(function(err, result) {
        });

        window.discussion.refreshThread(aId, tId);

      }

      mApi().forum.areas.threads.read(aId, tId).on('$', function(thread, threadCallback) {

        mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area) {
          thread.areaName = area.name;

        });
        threadCallback();
      }).callback(function(err, thread) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          openInSN('/discussion/discussion_create_reply.dust', thread, sendReply);
        }
      });
    },

    clearMessages : function() {
      $(DiscImpl.msgContainer).empty();
    },
    
    _loading : function(container, func) {
      if(func == "start"){
        $(container).addClass('mf-loading');
      }else{
        $(container).removeClass('mf-loading');        
      }
    },
    
    clearReplies : function() {
      $(DiscImpl.subContainer).empty();
    },
    
    _scrollToElement : function(el){
        var offT =  $(el).offset().top;
        var offH =  $(el).height();
        var offS = offT + offH;
       $("html,body").scrollTop(offS);
    },
    
    _onHashChange: function (event) {
      var hash = window.location.hash.substring(1);
      var _this = this;
       
        if (hash.indexOf("thread/") === 0) {
          var areaId = hash.substring(7,8);
          var threadId = hash.substring(9,10);
          var hI = hash.indexOf('/');
          var cHash = hash.substring(0, hI);
          _this._loadThread(areaId,threadId);
 
        }else if(hash.indexOf("area/") === 0){
          if (hash.indexOf("all") == -1){
           var areaId = hash.substring(5,6);
          }else{
           var areaId = "all";
          }
          this.filterMessagesByArea(areaId);
          $("#discussionAreaSelect").val(areaId);
        }else{
          this.refreshLatest();
        }

    },    

    _klass : {
      // Variables for the class
      msgContainer : ".di-messages-container",
      subContainer : ".di-sumbessages-container",

    }

  });

  window.discussion = new DiscImpl();
  
  $("#discussionAreaSelect").change(function() {
    
    window.location.hash =  "#area/" + $(this).val() ;
//    window.discussion.filterMessagesByArea($(this).val());
  });

  $(".di-new-message-button").click(function() {
    var selArea = $("#discussionAreaSelect").val();

    var createMessage = function(values) {
      var forumAreaId = null;

      for (value in values) {
        if (value == "forumAreaId") {
          var forumAreaId = values[value];
          delete values[value];
        }
      }
      
      if (values.title =='') {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.notitle'));
        return false;
      }
      if (values.message =='') {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nomessage'));
        return false;
      } else {
        mApi().forum.areas.threads.create(forumAreaId, values).callback(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            // Refresh selected area
            window.discussion.filterMessagesByArea($("#forumAreaIdSelect").val());
            $("#discussionAreaSelect").val(forumAreaId);
          }
        });
      }

    }

    mApi().forum.areas.read().callback(function(err, areas) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noareas', err));
      } else {
        openInSN('/discussion/discussion_create_message.dust', areas, createMessage);
      }
    });

  });

  $(".di-new-area-button").click(function() {

    var createArea = function(values) {
      mApi().forum.areas.create(values).callback(function(err, result) {
      });

      window.discussion.refreshLatest();
      window.discussion.refreshAreas();
    }

    mApi().forum.areas.read().callback(function(err, areas) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noareas', err));
      } else {
        openInSN('/discussion/discussion_create_area.dust', areas, createArea);
      }
    });

  });
});
