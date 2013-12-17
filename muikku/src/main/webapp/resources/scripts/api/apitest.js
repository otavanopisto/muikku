(function() {
  
  $(document).ready(function (event) {
    var api = mApi([
      'workspace/workspaces', 
      'workspace/workspaceEntities',
      'workspace/workspaces/users'
    ]);

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
        
    $('#post-test').click(function (event) {
      api.workspace.workspaces.create({
        "schoolDataSource": "MOCK",
        "name": "Test Workspace",
        "description": "Workspace created via new REST API",
        "workspaceTypeId": "2",
        "courseIdentifierIdentifier": "2"
      });
    });
  });
  
})(window);