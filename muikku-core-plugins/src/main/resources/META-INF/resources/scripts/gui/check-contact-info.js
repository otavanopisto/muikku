$(function() {
  mApi().user.students.read(MUIKKU_LOGGED_USER).callback(
      function(err, student) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error',
              err);
        }
        if (/* ! */student.updatedByStudent) {
          mApi().user.students.addresses.read(MUIKKU_LOGGED_USER).callback(
              function(err, addresses) {
                if (err) {
                  $('.notification-queue').notificationQueue('notification',
                      'error', err);
                }
                var address = null;
                for (var i = 0; i < addresses.length; i++) {
                  if (addresses[i].defaultAddress) {
                    address = addresses[i];
                  }
                }
                renderDustTemplate('frontpage/check-contact-info-dialog.dust',
                    {
                      street : address.street,
                      postalCode : address.postalCode,
                      city : address.city,
                      country : address.country,
                      municipality : student.municipality
                    }, function(text) {
                      var dialog = $(text);
                      dialog.dialog({
                        modal : true,
                        resizable : false,
                        width : 400,
                        dialogClass : "check-contact-info-dialog",
                        buttons : [
                          {
                            'text' : dialog.data('button-confirm-text'),
                            'class' : 'send-button',
                            'click' : function(event) {
                              $(this).dialog().remove();
                            }
                          },
                          {
                            'text' : dialog.data('button-ok-text'),
                            'class' : 'cancel-button',
                            'click' : function(event) {
                            }
                          }
                        ]
                      });
                    });
              });
        }
      });
});