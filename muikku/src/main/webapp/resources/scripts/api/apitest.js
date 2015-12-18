(function() {
  
  $(document).ready(function (event) {
    var api = mApi({async: false});

    // Single request
    
    api.workspace.workspaceEntities.read(2)
      .callback(function (err, result) {
        if (!err) {
          renderDustTemplate('apitest/single.dust', result, function (text) {
            $(text).appendTo('#content');
          });
        } else {
          alert(err);
        }
      }); 
    
    // List request
    
    api.workspace.workspaceEntities.read()
      .callback(function (err, result) {
        if (!err) {
          renderDustTemplate('apitest/list.dust', result, function (text) {
            $(text).appendTo('#content');
          });
        } else {
          alert(err);
        }
      });

    // Batch read
    
    api.batch({
      workspaceEntity: api.workspace.workspaceEntities.read(2),
      users: api.workspace.workspaces.users.read(2)
    })
    .callback(function (err, result) {
      if (!err) {
        renderDustTemplate('apitest/batch.dust', result, function (text) {
          $(text).appendTo('#content');
        });
      } else {
        alert(err);
      }
    });
    
    // Event on single entity

    api.workspace.workspaceEntities.read(2)
      .on('$', function (workspaceEntity, callback) {
        workspaceEntity.idSine = Math.sin(workspaceEntity.id);
        callback();
      })
      .callback(function (err, result) {
        if (!err) {
          renderDustTemplate('apitest/event_single.dust', result, function (text) {
            $(text).appendTo('#content');
          });
        } else {
          alert(err);
        }
      });
    
    // Event on list (adds idSine property into all entities)
    
    api.workspace.workspaceEntities.read()
      .on('$', function (entities, callback) {
        $.each(entities, function (index, entity) {
          entity.idSine = Math.sin(entity.id);
        });
        
        callback();
      })
      .callback(function (err, result) {
        if (!err) {
          renderDustTemplate('apitest/event_list.dust', result, function (text) {
            $(text).appendTo('#content');
          });
        } else {
          alert(err);
        }
      });

    // Replace property (replaces id with workspace)
    api.workspace.workspaceEntities.read(2)
      .replace('$', 'id', 'workspace', api.workspace.workspaces)
      .callback(function (err, result) {
        if (!err) {
          renderDustTemplate('apitest/replace_single.dust', result, function (text) {
            $(text).appendTo('#content');
          });
        } else {
          alert(err);
        }
      });
    // Replace property in list (replaces id with workspace)

    api.workspace.workspaceEntities.read()
      .replace('$', 'id', 'workspace', api.workspace.workspaces)
      .callback(function (err, result) {
        if (!err) {
          renderDustTemplate('apitest/replace_list.dust', result, function (text) {
            $(text).appendTo('#content');
          });
        } else {
          alert(err);
        }
      });
        
    $('#crud-test').click(function (event) {
      api.workspace.workspaces
        .create({
          "schoolDataSource": "MOCK",
          "name": "Test Workspace - " + new Date().getTime(),
          "description": "Workspace created via new REST API",
          "workspaceTypeId": "2",
          "courseIdentifierIdentifier": "2"
        })
        .callback(function (err, result) {
          if (err) {
            alert(err);
          } else {
            $('#crud-test-result').append($('<div>').html('<div>Created a workspace: ' + JSON.stringify(result) + '</div><div><a data-sds="' + result.schoolDataSource + '" data-id="' + result.identifier + '" class="crud-test-update" href="javascript:void(null)">Update</a>&nbsp;|&nbsp;<a data-sds="' + result.schoolDataSource + '" data-id="' + result.identifier + '" class="crud-test-delete" href="javascript:void(null)">Delete</a></div>'));
          }
        });
      
    });
    
    $(document).on("click", ".crud-test-update", function (event) {
      var link = $(event.target);
      var identifier = link.data('id');
      var schoolDataSource = link.data('sds');
      
      api.workspace.workspaceEntities
        .read({
          schoolDataSource: schoolDataSource,
          identifier: identifier
        })
        .add('$', 'id', 'workspace', api.workspace.workspaces)
        .callback(function (err, result) {
          if (err) {
            alert(err);
          } else {
            if (result.length == 1) {
              var workspace = result[0].workspace;
              workspace.name += '-modified';
              api.workspace.workspaces
                .update(result[0].id, workspace)
                .callback(function (updErr, updResult) {
                  if (updErr) {
                    alert(updErr);
                  } else {
                    $('#crud-test-result').append($('<div>').html('<div>Updated workspace: ' + JSON.stringify(updResult) + '</div><div><a data-sds="' + updResult.schoolDataSource + '" data-id="' + updResult.identifier + '" class="crud-test-update" href="javascript:void(null)">Update</a>&nbsp;|&nbsp;<a data-sds="' + updResult.schoolDataSource + '" data-id="' + updResult.identifier + '" class="crud-test-delete" href="javascript:void(null)">Delete</a></div>'));
                  }
                });
            }
          }
        });
    });
    
    $(document).on("click", ".crud-test-delete", function (event) {
      var link = $(event.target);
      var identifier = link.data('id');
      var schoolDataSource = link.data('sds');
      
      api.workspace.workspaceEntities
      .read({
        schoolDataSource: schoolDataSource,
        identifier: identifier
      })
      .add('$', 'id', 'workspace', api.workspace.workspaces)
      .callback(function (err, result) {
        if (err) {
          alert(err);
        } else {
          if (result.length == 1) {
            var workspace = result[0].workspace;
            workspace.name += '-modified';
            api.workspace.workspaces
              .del(result[0].id)
              .callback(function (delErr) {
                if (delErr) {
                  alert(delErr);
                } else {
                  $('#crud-test-result').append($('<div>').html('<div>Deleted workspace</div>'));
                }
              });
          }
        }
      });
    });
    
  });
  
})(window);