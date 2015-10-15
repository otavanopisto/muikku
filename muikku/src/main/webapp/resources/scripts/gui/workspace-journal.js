(function() {

  function confirmJournalEntryDeleteRequest(id) {
    renderDustTemplate(
        'workspace/workspace-journal-delete-request-confirm.dust', {}, $.proxy(
            function(text) {
              var dialog = $(text);
              $(text).dialog({
                modal : true,
                minHeight : 200,
                maxHeight : $(window).height() - 50,
                resizable : false,
                width : 560,
                dialogClass : "workspace-journal-confirm-dialog",
                buttons : [ {
                  'text' : dialog.data('button-delete-text'),
                  'class' : 'delete-button',
                  'click' : function(event) {
                    $('.delete-entry-' + id).click();
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

  function newJournalEntry() {
    var workspaceId = $("input[name='workspaceEntityId']").val();
    var sendJournalEntry = function(values) {

      mApi().workspace.workspaces.journal.create(workspaceId, values).callback(
          function(err, result) {
            if (!err) {
              window.location.reload();
            } else {
              alert("Error occurred: " + err);
            }
          });
    }

    openInSN('/workspace/workspace-journal-new-entry.dust', +workspaceId,
        sendJournalEntry);
  };

 function editJournalEntry(element) {
    var id = element.attr('data-entry-id');
    var workspaceId = $("input[name='workspaceEntityId']").val();
    openInSN('/workspace/workspace-journal-edit-entry.dust',
        {actionType: 'edit'
        ,message: element.find('.workspace-journal-content').html()
        ,title: element.find('.workspace-journal-title').html()}
      , function(values){
      console.log(values);
      mApi().workspace.journal.update(id, values).callback(
          function(err, result) {
            if (!err) {
              window.location.reload();
            } else {
              alert("Error occurred: " + err);
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
    var id = $(this).attr('data-entry-id');
    confirmJournalEntryDeleteRequest(id);
  });

  $(document).on('click', '.workspace-journal-new-entry-button',
      function(event) {
        newJournalEntry();
      });

  $(document).on('click', '.journal-edit-button', function(event) {
    editJournalEntry($(this).parent().parent());
  });

  $(document).on('change', '#studentSelectField', function() {
    $("#studentSelectForm")[0].submit();
  })

}).call(this);
