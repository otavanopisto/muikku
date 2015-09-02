(function() {
  
  function confirmForgotpasswordRequest(confirmCallback) {
    renderDustTemplate('forgotpassword/forgotpassword-request-confirm.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        resizable: false,
        width: 460,
        dialogClass: "forgotpassword-dialog",
        buttons: [{
          'text': dialog.data('button-send-text'),
          'class': 'send-button',
          'click': function(event) {
            $(this).dialog("close");
            confirmCallback();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog("close");
          }
        }]
      });
    }, this));
  }
  
  $(document).on('click', '.bt-forgotpassword', function (event, data) {
    confirmForgotpasswordRequest();
  });

}).call(this);
