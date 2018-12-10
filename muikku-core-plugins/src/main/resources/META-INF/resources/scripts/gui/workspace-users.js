(function() {

  $.widget("custom.workspaceTeachers", {
    options: {
      workspaceEntityId: null
    },
    
    _create: function () {
      this._loadTeacherList();
    },
    
    _loadTeacherList: function () {
      this.element.find('.workspace-teachers-list').addClass('loading');
      mApi().workspace.staffMembers.read(this.options.workspaceEntityId).callback($.proxy(function (err, teachers) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          renderDustTemplate('workspace/workspace-users-teachers.dust', {teachers: teachers}, $.proxy(function (text) {
            this.element.find('.workspace-teachers-list')
              .removeClass('loading')
              .html($.parseHTML(text));  
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
      this._loadStudentList(true);
      this.element.on("click", ".workspace-students-active", $.proxy(this._onWorkspaceStudentsActiveClick, this));
      this.element.on("click", ".workspace-students-inactive", $.proxy(this._onWorkspaceStudentsInactiveClick, this));
      this.element.on("click", ".workspace-users-archive", $.proxy(this._onWorkspaceStudentArchiveClick, this));
      this.element.on("click", ".workspace-users-unarchive", $.proxy(this._onWorkspaceStudentUnarchiveClick, this));
    },
    
    _loadStudentList: function(active) {
      this.element.find('.workspace-students-list').empty();
      this.element.find('.workspace-students-list').addClass('loading');
      
      mApi().workspace.workspaces.students.read(this.options.workspaceEntityId, {active: active}).callback($.proxy(function (err, students) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          if (active) {
            renderDustTemplate('workspace/workspace-users-students-active.dust', {students: students}, $.proxy(function (text) {
              this.element.find('.workspace-students-list')
                .removeClass('loading')
                .html($.parseHTML(text));
            }, this));
          }
          else {
            renderDustTemplate('workspace/workspace-users-students-inactive.dust', {students: students}, $.proxy(function (text) {
              this.element.find('.workspace-students-list')
                .removeClass('loading')
                .html($.parseHTML(text));
            }, this));
          }
        }
      }, this)); 
    },
    
    _onWorkspaceStudentsActiveClick: function (event) {
      this._loadStudentList(true);
    },

    _onWorkspaceStudentsInactiveClick: function (event) {
      this._loadStudentList(false);
    },

    _onWorkspaceStudentArchiveClick: function (event) {
      var userElement = $(event.target).closest('.workspace-users');
      var userName = $(event.target).attr('data-user-name');
      this._confirmArchive($.proxy(function() {
        this._toggleActivity(userElement, false);
      }, this), userName);
    },

    _onWorkspaceStudentUnarchiveClick: function (event) {
      var userElement = $(event.target).closest('.workspace-users');
      var userName = $(event.target).attr('data-user-name');
      this._confirmUnarchive($.proxy(function() {
        this._toggleActivity(userElement, true);
      }, this), userName);
    },
    
    _confirmArchive: function(confirmCallback, userName) {
      renderDustTemplate('workspace/workspace-users-archive-request-confirm.dust', { userName: userName }, $.proxy(function(text) {
        var dialog = $(text);
        $(text).dialog({
          modal : true,
          minHeight : 200,
          resizable : false,
          width : 560,
          dialogClass : "workspace-user-confirm-dialog",
          buttons : [ {
            'text' : dialog.attr('data-button-archive-text'),
            'class' : 'archive-button',
            'click' : function(event) {
              event.stopPropagation();
              confirmCallback();
              $(this).dialog("destroy").remove();
            }
          }, {
            'text' : dialog.attr('data-button-cancel-text'),
            'class' : 'cancel-button',
            'click' : function(event) {
              $(this).dialog("destroy").remove();
            }
          } ]
        });
      }, this));
    },
    
    _confirmUnarchive: function(confirmCallback, userName) {
      renderDustTemplate('workspace/workspace-users-unarchive-request-confirm.dust', { userName: userName }, $.proxy(function(text) {
        var dialog = $(text);
        $(text).dialog({
          modal : true,
          minHeight : 200,
          resizable : false,
          width : 560,
          dialogClass : "workspace-user-confirm-dialog",
          buttons : [ {
            'text' : dialog.attr('data-button-unarchive-text'),
            'class' : 'unarchive-button',
            'click' : function(event) {
              event.stopPropagation();
              confirmCallback();
              $(this).dialog("destroy").remove();
            }
          }, {
            'text' : dialog.attr('data-button-cancel-text'),
            'class' : 'cancel-button',
            'click' : function(event) {
              $(this).dialog("destroy").remove();
            }
          } ]
        });
      }, this));
    },

    _toggleActivity: function(userElement, active) {
      var workspaceEntityId = this.options.workspaceEntityId;
      var workspaceUserEntityId = userElement.attr('data-workspaceuserentity-id');
      var payload = {
        workspaceUserEntityId: workspaceUserEntityId,
        active: active
      };
      mApi().workspace.workspaces.students.update(workspaceEntityId, workspaceUserEntityId, payload).callback(function (err) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          $(userElement).remove();
        }
      });
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
