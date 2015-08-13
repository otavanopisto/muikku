(function() {
 
  function confirmJournalEntryDeleteRequest() {
    renderDustTemplate('workspace/workspace-journal-delete-request-confirm.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        minHeight: 200,
        maxHeight: $(window).height() - 50,
        resizable: false,
        width: 560,
        dialogClass: "workspace-journal-confirm-dialog",
        buttons: [{
          'text': dialog.data('button-delete-text'),
          'class': 'delete-button',
          'click': function(event) {
            $(this).dialog("destroy").remove();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog("destroy").remove();
          }
        }]
      });
    }, this));
  }
  
  /*
  function newJournalEntry() {
    var workspaceId = $("input[name='workspaceEntityId']").val();
    openInSN('/workspace/workspace-journal-new-entry.dust', workspaceId);
  };
  */
  
  function editJournalEntry() {
    var workspaceId = $("input[name='workspaceEntityId']").val();
    openInSN('/workspace/workspace-journal-edit-entry.dust', workspaceId);
  };
  
  $(document).on('click', '.journal-delete-button', function (event) {
    confirmJournalEntryDeleteRequest();
  });
  
  $(document).on('click', '.workspace-journal-new-entry-button', function (event) {
    newJournalEntry();
  });

  $(document).on('click', '.journal-edit-button', function (event) {
    editJournalEntry();
  });
  
}).call(this);
