(function() {
  
  /* global CKEDITOR,CONTEXTPATH */
  
  $(document).ready(function() {
    var fileId = $('.html-editor-html-material-id').val();
    if (!fileId) {
      // TODO: Error handling!
    }
    
    var serverUrl = CONTEXTPATH + '/rest/coops/' + fileId + '';
  
    CKEDITOR.plugins.addExternal('change', CONTEXTPATH + '/scripts/ckplugins/change/');
    CKEDITOR.plugins.addExternal('coops', CONTEXTPATH + '/scripts/ckplugins/coops/');
    CKEDITOR.plugins.addExternal('coops-connector', CONTEXTPATH + '/scripts/ckplugins/coops-connector/');
    CKEDITOR.plugins.addExternal('coops-dmp', CONTEXTPATH + '/scripts/ckplugins/coops-dmp/');
    CKEDITOR.plugins.addExternal('coops-cursors', CONTEXTPATH + '/scripts/ckplugins/coops-cursors/');
    CKEDITOR.plugins.addExternal('coops-sessionevents', CONTEXTPATH + '/scripts/ckplugins/coops-sessionevents/');
    
    var editor = CKEDITOR.appendTo($('.html-editor-ckcontainer')[0], {
      skin: 'moono',
      extraPlugins: 'coops,coops-connector,coops-dmp,coops-cursors,coops-sessionevents',
      readOnly: true,
      height: 500,
      coops: {
        serverUrl: serverUrl
      }
    });
//    
//    /* CoOps status messages */
//    
//    editor.on("CoOPS:SessionStart", function (event) {
//      $('.editor-status').html('Loaded');
//    });
//    
//    editor.on("CoOPS:ContentDirty", function (event) {
//      $('.editor-status').html('Unsaved');
//    });
//    
//    editor.on("CoOPS:PatchSent", function (event) {
//      $('.editor-status').html('Saving...');
//    });
//    
//    editor.on("CoOPS:PatchAccepted", function (event) {
//      $('.editor-status').html('Saved');
//    });
//
//    editor.on("CoOPS:ConnectionLost", function (event) {
//      $('.notifications').notifications('notification', 'load', event.data.message).addClass('connection-lost-notification');
//    });
//
//    editor.on("CoOPS:Reconnect", function (event) {
//      $('.notifications').find('.connection-lost-notification').notification("hide");
//    });
//
//    editor.on("CoOPS:CollaboratorJoined", function (event) {
//      $('.collaborators').collaborators("addCollaborator", event.data.sessionId, event.data.displayName||'Anonymous', event.data.email||(event.data.sessionId + '@no.invalid'));
//    });
//
//    editor.on("CoOPS:CollaboratorLeft", function (event) {
//      $('.collaborators').collaborators("removeCollaborator", event.data.sessionId);
//    });
//    
//    // CoOPS Errors
//    
//    editor.on("CoOPS:Error", function (event) {
//      $('.notifications').find('.connection-lost-notification').notification("hide");
//      
//      switch (event.data.severity) {
//        case 'CRITICAL':
//        case 'SEVERE':
//          $('.notifications').notifications('notification', 'error', event.data.message);
//        break;
//        case 'WARNING':
//          $('.notifications').notifications('notification', 'warning', event.data.message);
//        break;
//        default:
//          $('.notifications').notifications('notification', 'info', event.data.message);
//        break;
//      }
//    });
//    
//    $('input[name="name"]').change(function (event) {
//      var oldValue = $(this).parent().data('old-value');
//      var value = $(this).val();
//      $(this).parent().data('old-value', value);
//      
//      editor.fire("propertiesChange", {
//        properties : [{
//          property: 'title',
//          oldValue: oldValue,
//          currentValue: value
//        }]
//      });
//    });
//    
//    editor.on("CoOPS:PatchReceived", function (event) {
//      var properties = event.data.properties;
//      if (properties) {
//        $.each(properties, function (key, value) {
//          if (key === 'title') {
//            $('input[name="name"]').val(value);
//          }
//        });
//      }
//    });
//    
//    $('.collaborators').collaborators();
  });
  
}).call(this);