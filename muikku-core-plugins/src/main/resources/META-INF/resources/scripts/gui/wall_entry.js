(function() {
  
  DefaultWallEntryController = $.klass(WallEntryController, {
    render: function (data, callback) {
      mApi({async: false}).wall.walls.read(data.entry.wallId).callback($.proxy(function (err, wall) {
        if (err) {
          callback(err);
        } else {
          this._resolveTypeSpecific(wall, $.proxy(function (typeErr, typeSpecific) {
            if (typeErr) {
              callback(typeErr);
            } else {
              mApi({async: false}).user.users.read(data.entry.creatorId).callback($.proxy(function (creatorErr, creator) {
                if (creatorErr) {
                  callback(creatorErr);
                } else {
                  var creatorFullName = (creator.fistName ? creator.fistName + ' ' : '') + creator.lastName;
                  
                  this._loadReplies(data.entry, $.proxy(function (repliesErr, replies) {
                    if (repliesErr) {
                      callback(repliesErr);
                    } else {
                      renderDustTemplate('wall/wallentry.dust', {
                        wallId: wall.id,
                        entryId: data.entry.id,
                        creatorId: data.entry.creatorId,
                        text: data.entry.text,
                        created: data.entry.created, 
                        wallType: wall.type,
                        wallUserId: typeSpecific.wallUserId,
                        wallUserName: typeSpecific.wallUserName,
                        workspaceUrlName: typeSpecific.workspaceUrlName,
                        workspaceName: typeSpecific.workspaceName,
                        replies: replies,
                        creatorName: creatorFullName, 
                        creatorHasPicture: creator.hasImage
                      }, function (text) {
                        callback(null, text);
                      });
                    }
                  }, this));
                }
              }, this));
            }
          }, this));
        }
      }, this));
    },
    
    _resolveTypeSpecific: function (wall, callback) {
      switch (wall.type) {
        case 'ENVIRONMENT':
          callback(null, {});
        break;
        case 'USER':
          mApi({async: false}).user.users.read(wall.typeId).callback(function (err, user) {
            if (err) {
              callback(err);
            } else {
              var fullName = (user.fistName ? user.fistName + ' ' : '') + user.lastName;
              callback(null, {
                wallUserId: user.id,
                wallUserName: fullName
              });     
            }
          });
        break;
        case 'WORKSPACE':
          mApi({async: false}).workspace.workspaces.read(wall.typeId).callback(function (err, workspace) {
            if (err) {
              callback(err);
            } else {
              callback(null, {
                workspaceUrlName: workspace.urlName,
                workspaceName: workspace.name
              });     
            }
          });
        break;
      }
    },
    
    _loadReplies: function (entry, callback) {
      mApi({async: false}).wall.walls.wallEntries.replies.read(entry.wallId, entry.id)
        .on('$', function (reply, replyCallback) {
          mApi({async: false}).user.users.read(reply.creatorId).callback(function (err, user) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              reply.creatorFullName = (user.firstName ? user.firstName + ' ' : '') + user.lastName;
              reply.creatorHasPicture = user.hasImage;
              replyCallback();
            }
          });      
        })
        .callback(function (err, replies) {
          if (err) {
            callback(err);
          } else {
            callback(null, replies);
          }
        });
    }
  });
  
  $(document).on('click', '.wallWidget .wallEntryData', function (event) {
    if ($(this).find('.wallEntryCommentForm').length == 0) {
      renderDustTemplate('wall/newcomment.dust', {
        wallId: $(this).find("input[name='wallId']").val(),
        wallEntryId: $(this).find("input[name='wallEntryId']").val()
      }, $.proxy(function (text) {
        $(this).closest('.wallEntry').append(text);
      }, this));
    }
  });
  
  $(document).on('click', 'input[name="wallEntryCommentBtn"]', function (event) {
    event.preventDefault();
    
    var entryId = $(this).closest('.wallEntryCommentFormForm').find('input[name="wallEntryId"]').val();
    var wallId = $(this).closest('.wallEntryCommentFormForm').find('input[name="wallId"]').val();
    var text = $(this).closest('.wallEntryCommentFormForm').find('input[name="wallEntryCommentText"]').val();
    
    mApi({async: false}).wall.walls.wallEntries.replies.create(wallId, entryId, { text: text })
      .on('$', function (reply, callback) {
        mApi({async: false}).user.users.read(reply.creatorId).callback(function (err, user) {
          if (err) {
            callback(err);
          } else {
            reply.creatorFullName = (user.firstName ? user.firstName + ' ' : '') + user.lastName;
            reply.creatorHasPicture = user.hasImage;
            callback();
          }
        });
      })
      .callback($.proxy(function (err, reply) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          renderDustTemplate('wall/wallentryreply.dust', reply, $.proxy(function (text) {
            $(this).closest('.wallEntry').find('.wallEntryComments').append(text);
            $(this).closest('.wallEntryCommentForm').remove();
          }, this));
        }
      }, this));
  });
  
  addWallEntryController('wallEntries', DefaultWallEntryController);
  
}).call(this);