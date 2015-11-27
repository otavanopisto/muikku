(function() {

  $.widget("custom.workspaceTeachers", {
    options: {
      workspaceEntityId: null
    },
    
    _create: function () {
      this._loadTeacherList();
    },
    
    _loadTeacherList: function () {
      mApi().workspace.workspaces.staffmembers.read(this.options.workspaceEntityId, {orderBy: 'name'}).callback($.proxy(function (err, teachers) {
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
      this._loadStudentList(true);
      this.element.on("click", ".workspace-students-active", $.proxy(this._onWorkspaceStudentsActiveClick, this));
      this.element.on("click", ".workspace-students-inactive", $.proxy(this._onWorkspaceStudentsInactiveClick, this));
      this.element.on("click", ".workspace-users-archive", $.proxy(this._onWorkspaceStudentArchiveClick, this));
      this.element.on("click", ".workspace-users-unarchive", $.proxy(this._onWorkspaceStudentUnarchiveClick, this));
    },
    
    _loadStudentList: function(active) {
      mApi().workspace.workspaces.students.read(this.options.workspaceEntityId, {active: active, orderBy: 'name'}).callback($.proxy(function (err, students) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          this.element.find('.workspace-students-list').empty();
          if (active === true) {
            renderDustTemplate('workspace/workspace-users-students-active.dust', {students: students}, $.proxy(function (text) {
              this.element.find('.workspace-students-list').append($.parseHTML(text));
            }, this));
          }
          else {
            renderDustTemplate('workspace/workspace-users-students-inactive.dust', {students: students}, $.proxy(function (text) {
              this.element.find('.workspace-students-list').append($.parseHTML(text));
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
      this._confirmArchive($.proxy(function() {
        this._archive(userElement);
      }, this));
    },

    _onWorkspaceStudentUnarchiveClick: function (event) {
      var userElement = $(event.target).closest('.workspace-users');
      this._confirmUnarchive($.proxy(function() {
        this._unarchive(userElement);
      }, this));
    },
    
    _confirmArchive: function(confirmCallback) {
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
    
    _confirmUnarchive: function(confirmCallback) {
      renderDustTemplate('workspace/workspace-users-unarchive-request-confirm.dust', {}, $.proxy(function(text) {
        var dialog = $(text);
        $(text).dialog({
          modal : true,
          minHeight : 200,
          maxHeight : $(window).height() - 50,
          resizable : false,
          width : 560,
          dialogClass : "workspace-user-confirm-dialog",
          buttons : [ {
            'text' : dialog.data('button-unarchive-text'),
            'class' : 'unarchive-button',
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

    _archive: function(userElement) {
      var workspaceEntityId = this.options.workspaceEntityId;
      var workspaceUserEntityId = userElement.data('user-id');
      mApi().workspace.workspaces.users.read(workspaceEntityId, workspaceUserEntityId).callback(function (err, workspaceUserEntity) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          workspaceUserEntity.active = false;
          mApi().workspace.workspaces.users.update(workspaceEntityId, workspaceUserEntityId, workspaceUserEntity).callback(function (err, html) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              $(userElement).remove();
            }
          });
        }
      });
    },
    
    _unarchive: function(userElement) {
      var workspaceEntityId = this.options.workspaceEntityId;
      var workspaceUserEntityId = userElement.data('user-id');
      mApi().workspace.workspaces.users.read(workspaceEntityId, workspaceUserEntityId).callback(function (err, workspaceUserEntity) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          workspaceUserEntity.active = true;
          mApi().workspace.workspaces.users.update(workspaceEntityId, workspaceUserEntityId, workspaceUserEntity).callback(function (err, html) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            }
            else {
              $(userElement).remove();
            }
          });
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
