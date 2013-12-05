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
        if (err) {
          console.error(err);
        } else {
          console.log(["Workspace entity", result]);
        }
      }); 
    
    // List request
    
    api.workspace.workspaceEntities.read()
      .callback(function (err, result) {
        if (err) {
          console.error(err);
        } else {
          console.log(["Workspace entities", result]);
        }
      });

    // Batch read
    
    api.batch({
      workspaceEntities: api.workspace.workspaceEntities.read(2),
      members: api.workspace.workspaces.users.read(2)
    })
    .callback(function (err, result) {
      console.log(["Batch result", result]);
    });
    
    // Event on single entity

    api.workspace.workspaceEntities.read(2)
      .on('$', function (workspaceEntity, callback) {
        api.workspace.workspaces.read(workspaceEntity.id)
          .callback(function (err, result) {
            delete workspaceEntity.id;
            workspaceEntity.workspace = result;
            callback();
          });
      })
      .callback(function (err, result) {
        console.log(["Event result", result]);
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
        console.log(["Event result", result]);
      });

    // Replace property (replaces id with workspace)
    api.workspace.workspaceEntities.read(2)
      .replace('$', 'id', 'workspace', api.workspace.workspaces)
      .callback(function (err, result) {
        console.log(["Replaced result", result]);
      });
    // Replace property in list (replaces id with workspace)

    api.workspace.workspaceEntities.read()
      .replace('$', 'id', 'workspace', api.workspace.workspaces)
      .callback(function (err, result) {
        console.log(["Replaced result", result]);
      });
  });
  
})(window);