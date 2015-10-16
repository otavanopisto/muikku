(function() {
  'use strict';

  
  $.widget("custom.evaluationLoader", {
    
    _create : function() {
      this._pendingStudentLoads = [];
      this._loadingStudent = false;

      this._pendingWorkspaceMaterialReplyLoads = [];
      this._loadingWorkspaceMaterialReplies = false;
    },
    
    loadStudent: function (id, callback) {
      this._pendingStudentLoads.push({
        id: id,
        callback: callback
      });
      
      if (!this._loadingStudent) {
        this._loadNextStudent();
      }
    },
    
    loadWorkspaceMaterialReplies: function (workspaceEntityId, workspaceMaterialId, userEntityId, callback) {
      this._pendingWorkspaceMaterialReplyLoads.push({
        workspaceEntityId: workspaceEntityId,
        workspaceMaterialId: workspaceMaterialId,
        userEntityId: userEntityId,
        callback: callback
      });
      
      if (!this._loadingWorkspaceMaterialReplies) {
        this._loadNextWorkspaceMaterialReply();
      }
      
    },
    
    _loadNextStudent: function () {
      if (this._pendingStudentLoads.length) { 
        this._loadingStudent = true;
        var pendingLoad = this._pendingStudentLoads.shift();
        
        mApi().user.users.basicinfo
          .read(pendingLoad.id)
          .callback($.proxy(function (err, user) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              pendingLoad.callback(user);
            }
            
            this._loadingStudent = false;
            this._loadNextStudent();
          }, this)); 
      }
    },
    
    _loadNextWorkspaceMaterialReply: function () {
      if (this._pendingWorkspaceMaterialReplyLoads.length) { 
        this._loadingWorkspaceMaterialReplies = true;
        var pendingLoad = this._pendingWorkspaceMaterialReplyLoads.shift();
        
        mApi().workspace.workspaces.materials.compositeMaterialReplies
          .read(pendingLoad.workspaceEntityId, pendingLoad.workspaceMaterialId, {
            userEntityId: pendingLoad.userEntityId
          })
          .callback($.proxy(function (err, reply) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              pendingLoad.callback(reply);
            }
            
            this._loadingWorkspaceMaterialReplies = false;
            this._loadNextWorkspaceMaterialReply();
          }, this)); 
      }
    }
    
  });
  
  $.widget("custom.evaluation", {
    options: {
      workspaceEntityId: null
    },
    
    _create : function() {
      this._workspaceUsers = null;
      this._viewOffsetX = 0;
      this._viewOffsetY = 0;
      
      $('<button>')
        .addClass('prevPage icon-arrow-left')
        .on("click", $.proxy(this._onPrevPageClick, this))
        .appendTo(this.element);
      
      $('<div>')
        .addClass('evaluation-students')
        .appendTo(this.element);
      
      $('<div>')
        .addClass('evaluation-assignments')
        .appendTo(this.element);

      $('<button>')
        .addClass('nextPage icon-arrow-right')
        .on("click", $.proxy(this._onNextPageClick, this))
        .appendTo(this.element);

      this.element.on("studentsLoaded", $.proxy(this._onStudentsLoaded, this));
      this.element.on("materialsLoaded", $.proxy(this._onMaterialsLoaded, this));
      
      this._loadStudents();
    },
    
    _scrollView: function (x, y) {
      this._viewOffsetX += x;
      this._viewOffsetY += y;
      
      this.element.find('.evaluation-assignments,.evaluation-students')
        .css({
          marginLeft: (-this._viewOffsetX) + 'px',
          marginTop: this._viewOffsetY + 'px'
        });
      
      this.element.trigger('viewScroll', {
        viewOffsetX: this._viewOffsetX,
        viewOffsetY: this._viewOffsetY,
        viewOffsetChangeX: x,
        viewOffsetChangeY: y
      });
    },

    _loadStudents: function () {
      mApi().workspace.workspaces.users
        .read(this.options.workspaceEntityId)
        .callback($.proxy(function (err, workspaceUsers) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            this.element.trigger("studentsLoaded", {
              workspaceUsers: workspaceUsers
            });
          }
        }, this)); 
    },
    
    _loadMaterials: function () {
      mApi().workspace.workspaces.materials
        .read(this.options.workspaceEntityId, { assignmentType : 'EVALUATED'})
        .callback($.proxy(function (err, workspaceEvaluableAssignments) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            this.element.trigger("materialsLoaded", {
              workspaceEvaluableAssignments: workspaceEvaluableAssignments
            });
          }
        }, this)); 
    },
    
    _onPrevPageClick: function () {
      var cellWidth = this.element.find('.evaluation-student-wrapper').first().outerWidth(true);
      this._scrollView(-cellWidth * 5, 0);
    },
    
    _onNextPageClick: function () {
      var cellWidth = this.element.find('.evaluation-student-wrapper').first().outerWidth(true);
      this._scrollView(cellWidth * 5, 0);
    },
    
    _onStudentsLoaded: function (event, data) {
      this._workspaceUsers = data.workspaceUsers;
      
      $.each(this._workspaceUsers, $.proxy(function (index, workspaceUser) {
        $('<div>')
          .evaluationStudent({
            workspaceStudentEntityId: workspaceUser.id,
            userId: workspaceUser.userId
          })
          .appendTo(this.element.find('.evaluation-students'));
      }, this));
      
      this._loadMaterials();
    },
    
    _onMaterialsLoaded: function (event, data) {
      this._workspaceEvaluableAssignments = data.workspaceEvaluableAssignments;
      
      $.each(this._workspaceEvaluableAssignments, $.proxy(function (materialIndex, workspaceEvaluableAssignment) {
        var materialRow = $('<div>')
          .addClass('evaluation-student-assignment-listing-row')
          .appendTo($('.evaluation-assignments'));
        
        $.each(this._workspaceUsers, $.proxy(function (studentIndex, workspaceUser) {
          $('<div>')
            .evaluationAssignment({
              workspaceEntityId: this.options.workspaceEntityId,
              workspaceMaterialId: workspaceEvaluableAssignment.id,
              title: workspaceEvaluableAssignment.title,
              workspaceUserEntityId: workspaceUser.id,
              userEntityId: workspaceUser.userId
            })
            .appendTo(materialRow);
          }, this));
      }, this));
      
      this.element.trigger("viewInitialized");
    }
    
  });
  
  $.widget("custom.evaluationAssignment", {
    
    options: {
      workspaceEntityId: null,
      workspaceMaterialId: null,
      title: null,
      workspaceUserEntityId: null,
      userEntityId: null
    },
    
    _create : function() {
      this.element.addClass('evaluation-assignment-wrapper evaluation-assignment-pending');
      this.element.append($('<div>').addClass('evaluation-assignment-picture'));
      this.element.append($('<div>').addClass('evaluation-assignment-title').text(this.options.title));
      this.element.append($('<div>').addClass('evaluation-assignment-date'));

      $('.evaluation').on("viewInitialized", $.proxy(this._onEvaluationViewInitialized, this));
      $('.evaluation').on("viewScroll", $.proxy(this._onEvaluationViewScroll, this));
    },
      
    _load: function () {
      this.element
        .removeClass('evaluation-assignment-pending')
        .addClass('evaluation-assignment-loading');
            
      $('#evaluation').evaluationLoader('loadWorkspaceMaterialReplies', this.options.workspaceEntityId, this.options.workspaceMaterialId, this.options.userEntityId, $.proxy(function (reply) {
        this.element
          .removeClass('evaluation-assignment-loading')
          .addClass('evaluation-assignment-loaded');
        this._onWorkspaceMaterialReplyLoaded(reply);
      }, this));
    },
    
    _onEvaluationViewInitialized: function (event, data) {
      if (this.element.hasClass('evaluation-assignment-pending')) {
        var viewWidth = $(event.target).width();
        
        var offset = this.element.offset();
        if (offset.left < viewWidth) {
          this._load();  
        }
      }
    },
    
    _onEvaluationViewScroll: function (event, data) {
      if (this.element.hasClass('evaluation-assignment-pending')) {
        var viewWidth = $(event.target).width();
        
        var offset = this.element.offset();
        if ((offset.left - data.viewOffsetChangeX) < (viewWidth)) {
          this._load();  
        }
      }
    },
    
    _onWorkspaceMaterialReplyLoaded: function (reply) {
      switch (reply.state) {
        case 'UNANSWERED':
          this.element.addClass('assignment-unaswered');
        break;
        case 'ANSWERED':
          this.element.addClass('assignment-aswered');
        break;
        case 'SUBMITTED':
          this.element.addClass('assignment-submitted');
          if (reply.submitted) {
            this.element.find('.evaluation-assignment-date')
              .text(formatDate(new Date(reply.submitted)));   
          }
        break;
        case 'WITHDRAWN':
          this.element.addClass('assignment-withdrawn');
        break;
        case 'EVALUATED':
          this.element.addClass('assignment-evaluated');
        break;
      }
    }
  
  });
  
  $.widget("custom.evaluationStudent", {
    
    options: {
      workspaceStudentEntityId: null,
      userId: null
    },
    
    _create : function() {
      this.element.addClass('evaluation-student-wrapper evaluation-student-pending');
      this.element.append($('<div>').addClass('evaluation-student-picture'));
      this.element.append($('<div>').addClass('evaluation-student-name').text('Loading...'));

      $('.evaluation').on("viewInitialized", $.proxy(this._onEvaluationViewInitialized, this));
      $('.evaluation').on("viewScroll", $.proxy(this._onEvaluationViewScroll, this));
    },
    
    _loadBasicInfo: function () {
      this.element
        .removeClass('evaluation-student-pending')
        .addClass('evaluation-student-loading');
      
      $('#evaluation').evaluationLoader('loadStudent', this.options.userId, $.proxy(function (user) {
        this.element
          .removeClass('evaluation-student-pending evaluation-student-loading')
          .addClass('evaluation-student-loaded');
        this._onBasicInfoLoaded(user);
      }, this));
    },
    
    _onEvaluationViewInitialized: function (event, data) {
      if (this.element.hasClass('evaluation-student-pending')) {
        var viewWidth = $(event.target).width();
        var studentOffset = this.element.offset();
        if (studentOffset.left < viewWidth) {
          this._loadBasicInfo();  
        }
      }
    },
    
    _onEvaluationViewScroll: function (event, data) {
      if (this.element.hasClass('evaluation-student-pending')) {
        var viewWidth = $(event.target).width();
        var studentOffset = this.element.offset();
        if ((studentOffset.left - data.viewOffsetChangeX) < (viewWidth)) {
          this._loadBasicInfo();  
        }
      }
    },
    
    _onBasicInfoLoaded: function (user) {
      var fullName = user.firstName + ' ' + user.lastName + ' <' + user.email + '>';
      this.element.find('.evaluation-student-name').text(fullName);
    }
  
  });

  $(document).ready(function () {
    $('#evaluation').evaluationLoader();
    $('#evaluation').evaluation({
      workspaceEntityId: $('#evaluation').attr('data-workspace-entity-id')
    }); 
  });

}).call(this);
