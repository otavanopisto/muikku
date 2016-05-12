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
      mApi().workspace.workspaces.staffMembers.read(this.options.workspaceEntityId, {orderBy: 'name'}).callback($.proxy(function (err, teachers) {
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
      this._loadStudentList(false);
      this.element.on("click", ".workspace-students-active", $.proxy(this._onWorkspaceStudentsActiveClick, this));
      this.element.on("click", ".workspace-students-inactive", $.proxy(this._onWorkspaceStudentsInactiveClick, this));
      this.element.on("click", ".workspace-users-archive", $.proxy(this._onWorkspaceStudentArchiveClick, this));
      this.element.on("click", ".workspace-users-unarchive", $.proxy(this._onWorkspaceStudentUnarchiveClick, this));
    },
    
    _loadStudentList: function(archived) {
      this.element.find('.workspace-students-list').empty();
      this.element.find('.workspace-students-list').addClass('loading');
      
      mApi().workspace.workspaces.students.read(this.options.workspaceEntityId, {archived: archived, orderBy: 'name'}).callback($.proxy(function (err, students) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          if (archived === false) {
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
      this._loadStudentList(false);
    },

    _onWorkspaceStudentsInactiveClick: function (event) {
      this._loadStudentList(true);
    },

    _onWorkspaceStudentArchiveClick: function (event) {
      var userElement = $(event.target).closest('.workspace-users');
      var userName = $(event.target).attr('data-user-name');
      this._confirmArchive($.proxy(function() {
        this._archive(userElement);
      }, this), userName);
    },

    _onWorkspaceStudentUnarchiveClick: function (event) {
      var userElement = $(event.target).closest('.workspace-users');
      var userName = $(event.target).attr('data-user-name');
      this._confirmUnarchive($.proxy(function() {
        this._unarchive(userElement);
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
      mApi().workspace.workspaces.students.read(workspaceEntityId, workspaceUserEntityId).callback(function (err, workspaceUserEntity) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          workspaceUserEntity.archived = true;
          mApi().workspace.workspaces.students.update(workspaceEntityId, workspaceUserEntityId, workspaceUserEntity).callback(function (err, html) {
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
      mApi().workspace.workspaces.students.read(workspaceEntityId, workspaceUserEntityId).callback(function (err, workspaceUserEntity) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          workspaceUserEntity.archived = false;
          mApi().workspace.workspaces.students.update(workspaceEntityId, workspaceUserEntityId, workspaceUserEntity).callback(function (err, html) {
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
