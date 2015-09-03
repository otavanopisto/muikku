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
            
            var emailField = $("#forgotpassword-email");

            if (emailField == 'invalid') {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.invalid"));  
            } else if (emailField.val() == '') {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.required"));  
            } else if (emailField == 'noUserFound') {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.noUserFound"));
            } else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.forgotPassword.forgotPasswordDialog.mailSent"));
              $(this).dialog("close");
            }           
            
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
