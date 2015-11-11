(function() {
  
  function confirmUserDelete(id) {
    renderDustTemplate('workspace/workspace-users-delete-request-confirm.dust', {id:id}, $.proxy(
      function(text) {
        var dialog = $(text);
        $(text).dialog({
          modal : true,
          minHeight : 200,
          maxHeight : $(window).height() - 50,
          resizable : false,
          width : 560,
          dialogClass : "workspace-user-confirm-dialog",
          buttons : [ {
            'text' : dialog.data('button-delete-text'),
            'class' : 'delete-button',
            'click' : function(event) {
              $(this).dialog("destroy").remove();
            }
          }, {
            'text' : dialog.data('button-cancel-text'),
            'class' : 'cancel-button',
            'click' : function(event) {
              $(this).dialog("destroy").remove();
            }
          } ]
        });
      }, this));
  }
  
  function confirmUserArchive(id) {
    renderDustTemplate('workspace/workspace-users-archive-request-confirm.dust', {id:id}, $.proxy(
      function(text) {
        var dialog = $(text);
        $(text).dialog({
          modal : true,
          minHeight : 200,
          maxHeight : $(window).height() - 50,
          resizable : false,
          width : 560,
          dialogClass : "workspace-user-confirm-dialog",
          buttons : [ {
            'text' : dialog.data('button-archive-text'),
            'class' : 'archive-button',
            'click' : function(event) {
              $(this).dialog("destroy").remove();
            }
          }, {
            'text' : dialog.data('button-cancel-text'),
            'class' : 'cancel-button',
            'click' : function(event) {
              $(this).dialog("destroy").remove();
            }
          } ]
        });
      }, this));
  }

  $(document).ready(function() {
    
    /* Get Workspace Teachers */
    mApi().user.users.read()
    .callback(function (err, teachers) {

      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', err);
      } else {
        renderDustTemplate('workspace/workspace-users-teachers.dust', {teachers:teachers}, function (text) {
          $(".workspace-teachers-listing-wrapper").append($.parseHTML(text));  
        });
      }
      
    });  
    
    /* Get Workspace Students */
    mApi().user.users.read()
    .callback(function (err, students) {

      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', err);
      } else {
        renderDustTemplate('workspace/workspace-users-students.dust', {students:students}, function (text) {
          $(".workspace-students-listing-wrapper").append($.parseHTML(text));
        });
      }
      
    }); 

  });
  
  $(document).on('click', '.workspace-users-archive', function(event) {
    var id = $(this).closest(".workspace-users").attr("data-user-id");
    confirmUserArchive(id);
  });
  
  $(document).on('click', '.workspace-users-delete', function(event) {
    var id = $(this).closest(".workspace-users").attr("data-user-id");
    confirmUserDelete(id);
  });
  
}).call(this);
