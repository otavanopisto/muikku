(function() {
  
  function confirmForgotpasswordRequest(confirmCallback) {
    renderDustTemplate('forgotpassword/forgotpassword-request-confirm.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        resizable: false,
        width: 460,
        dialogClass: "forgotpassword-dialog",
        beforeClose: function(event, ui) {
          $(this).dialog().remove();          
        },
        buttons: [{
          'text': dialog.data('button-send-text'),
          'class': 'send-button',
          'click': function(event) {
            
            var emailField = $("#forgotpassword-email");
            var email = emailField.val().trim();
            var dlog = $(this);

            if (emailField == 'invalid') {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.invalid"));  
            } else if (email == '') {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.required"));  
            } 
            
            mApi({async: false}).forgotpassword.reset.read({ email: email }).callback(function (err, response) {
              if (err) {
                if (response.status == 404) {
                  $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.noUserFound", email));
                } else { // most likely 400 - bad request
                  $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.invalid"));  
                } 
                
              } else {
                $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.forgotPassword.forgotPasswordDialog.mailSent", email));
                dlog.dialog().remove();
              }
            });
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog().remove();
          }
        }]
      });
    }, this));
  }
  
  $(document).on('click', '.forgotpassword-link', function (event, data) {
    event.preventDefault();
    confirmForgotpasswordRequest();
  });

}).call(this);
