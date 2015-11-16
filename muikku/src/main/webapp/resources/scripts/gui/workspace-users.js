(function() {

  $.widget("custom.workspaceTeachers", {
    options: {
      workspaceEntityId: null
    },
    
    _create: function () {
      this._loadTeacherList();
    },
    
    _loadTeacherList: function () {
       // Workspace teachers
      mApi().workspace.workspaces.users.read(this.options.workspaceEntityId, {roleArchetype: 'TEACHER', orderBy: 'name'}).callback($.proxy(function (err, teachers) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          renderDustTemplate('workspace/workspace-users-teachers.dust', {teachers: teachers}, $.proxy(function (text) {
            this.element.append($.parseHTML(text));  
          }, this));
        }
      }, this));  
    }
  });

  $.widget("custom.workspaceStudents", {
    options: {
      workspaceEntityId: null
    },
    
    _create: function () {
      this._loadStudentList();
      
      this.element.on("click", ".workspace-users-archive", $.proxy(this._onWorkspaceStudentArchiveClick, this));
    },
    
    _loadStudentList: function () {
      // Workspace students
      mApi().workspace.workspaces.users.read(this.options.workspaceEntityId, {roleArchetype: 'STUDENT', orderBy: 'name'}).callback($.proxy(function (err, students) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          renderDustTemplate('workspace/workspace-users-students.dust', {students: students}, $.proxy(function (text) {
            this.element.append($.parseHTML(text));
          }, this));
        }
      }, this)); 
    },
    
    _onWorkspaceStudentArchiveClick: function (event) {
      var studentElement = $(event.target).closest('.workspace-users');
      var studentId = studentElement.data('user-id');
      this._confirmArchiveStudent($.proxy(function() {
        this._archiveStudent(studentId);
      }, this));
    },
    
    _confirmArchiveStudent: function(confirmCallback) {
      renderDustTemplate('workspace/workspace-users-archive-request-confirm.dust', {}, $.proxy(function(text) {
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
              event.stopPropagation();
              confirmCallback();
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
    },
    
    /* TODO implement
    _confirmDeleteStudent: function(confirmCallback) {
      renderDustTemplate('workspace/workspace-users-delete-request-confirm.dust', {}, $.proxy(function(text) {
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
    },
    */
    
    _archiveStudent: function(studentId) {
      // TODO archive student
    }
  });
    
  
  $(document).ready(function() {
    $('.workspace-teachers-listing-wrapper').workspaceTeachers({
      workspaceEntityId: $("input[name='workspaceEntityId']").val()
    });
    
    $('.workspace-students-listing-wrapper').workspaceStudents({
      workspaceEntityId: $("input[name='workspaceEntityId']").val()
    });  
  });
  
}).call(this);
