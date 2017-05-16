(function() {
  'use strict';

  $.widget("custom.journal", {
    _create : function() {
      this._student = undefined;
      this.loadPage(this.options.workspaceId, this._student, 1);
      if (this.options.canListAllEntries)
        this._loadStudents(this.options.workspaceId);

      $(document).on('change', '#studentSelectField', $.proxy(this._onStudentSelectFieldChange, this));
      this.element.on('click', '.wj-page-link-load-more:not(.disabled)', $.proxy(this._onLoadMoreClick, this));
    },
    
    loadPage: function(workspaceId, userEntityId, page) {
      var firstResult = (page - 1) * this.options.pageSize;
      this._page = page;
      
      var params = { 
        firstResult: firstResult, 
        maxResults: this.options.pageSize 
      };
      
      if (userEntityId)
        params["userEntityId"] = userEntityId;
      
      mApi().workspace.workspaces.journal.read(workspaceId, params).callback(
        $.proxy(function(err, journalEntries) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            var template = this.options.canListAllEntries ? 'journal/journalentries_teacher.dust' : 'journal/journalentries_my.dust';
            
            if ((page == 1) && (journalEntries.length == 0))
              $("#noEntriesMessage").show();
            else
              $("#noEntriesMessage").hide();
            
            renderDustTemplate(template, journalEntries, function(text) {
              $("#journalEntries").append(text);
            });
            
            if (journalEntries && (journalEntries.length < this.options.pageSize))
              $('.wj-page-link-load-more').addClass('disabled');
            else
              $('.wj-page-link-load-more').removeClass('disabled');
          }
        }, this));
    },
    getPage: function() {
      return this._page;
    },
    clearResults: function() {
      $("#journalEntries").empty();
    },
    _loadStudents: function(workspaceId) {
      mApi().workspace.workspaces.students.read(workspaceId, { 
        archived: false, 
        orderBy: 'name' })
      .callback($.proxy(function (err, students) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        }
        else {
          $.each(students, function (ind, student) {
            $("<option/>", {
              'value': student.studentEntityId
            }).text(student.lastName + ', ' + student.firstName).appendTo("#studentSelectField");
          });
        }
      }, this)); 
    },
    _onStudentSelectFieldChange: function() {
      var selectedStudent = $("#studentSelectField").val();
      this._student = selectedStudent;
      this.clearResults();
      this.loadPage(this.options.workspaceId, this._student, 1);
    },
    _onLoadMoreClick: function() {
      this.loadPage(this.options.workspaceId, this._student, this.getPage() + 1);
    }
  });
  
  $(document).ready(function() {
    $('.journal').journal({
      workspaceId: $("input[name='workspaceEntityId']").val(),
      canListAllEntries: $('.journal').attr('data-canListAllEntries') == 'true',
      pageSize: 20,
      groupMessagingPermission: $('.journal').attr('data-daadaa') == 'true'
    });
  });

}).call(this);



(function() {

  function confirmJournalEntryDeleteRequest(id) {
    renderDustTemplate(
        'workspace/workspace-journal-delete-request-confirm.dust', {}, $.proxy(
            function(text) {
              var dialog = $(text);
              $(text).dialog({
                modal : true,
                minHeight : 200,
                resizable : false,
                width : 560,
                dialogClass : "workspace-journal-confirm-dialog",
                buttons : [ {
                  'text' : dialog.data('button-delete-text'),
                  'class' : 'delete-button',
                  'click' : function(event) {
                    var workspaceEntityId = $("input[name='workspaceEntityId']").val();
                    mApi().workspace.workspaces.journal.del(workspaceEntityId, id)
                      .callback(function(err, result) {
                        if (!err) {
                          window.location.reload(true);
                        } else {
                          $('.notification-queue').notificationQueue('notification', 'error', err);
                        }
                      });
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

  function newJournalEntry() {
    var workspaceId = $("input[name='workspaceEntityId']").val();
    var sendJournalEntry = function(values) {
      mApi({async: false}).workspace.workspaces.journal
        .create(workspaceId, values)
        .callback(function(err, result) {
          if (!err) {
            window.location.reload(true);
          }
          else {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
        });
    }

    openInSN('/workspace/workspace-journal-new-entry.dust', {
      draftKey: 'journal-' + workspaceId + '-new'
    }, sendJournalEntry);
  };

  function editJournalEntry(element) {
    var id = element.attr('data-entry-id');
    var workspaceId = $("input[name='workspaceEntityId']").val();
    openInSN('/workspace/workspace-journal-edit-entry.dust', {
      actionType: 'edit',
      draftKey: 'journal-' + workspaceId + '-' + id,
      message: element.find('.workspace-journal-content').html(),
      title: element.find('.workspace-journal-title').html()
    },
    function(values) {
      mApi({async: false}).workspace.journal
        .update(id, values)
        .callback(function(err, result) {
          if (!err) {
            window.location.reload(true);
          }
          else {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          }
        });
    });
  }
  
  function cancelJournalEntryEdit(element){
    var view = element.find('.workspace-journal-entry-view');
    var form = element.find('.edit-journal-entry-form');
    view.show();
    form.parent().hide();
  }
  
  $(document).on('click', '.cancel-entry-edit-btn', function(event) {
    event.preventDefault();
    cancelJournalEntryEdit($(this).parent().parent().parent());
  });

  $(document).on('click', '.journal-delete-button', function(event) {
    confirmJournalEntryDeleteRequest($(this).attr('data-entry-id'));
  });

  $(document).on('click', '.workspace-journal-new-entry-button', function(event) {
    newJournalEntry();
  });

  $(document).on('click', '.journal-edit-button', function(event) {
    editJournalEntry($(this).closest('.workspace-single-journal-entry'));
  });

}).call(this);
