//DEPRECATED, this behaviour is specific to certain components, in this case
//this will be used by the main-function widget and it'll be in charge of doing such changes
//please remove it and all its references once the changes are done over all the codebase.
(function() {
  'use strict';
  
  function reloadMessageCount() {
    if (MUIKKU_LOGGEDIN) {
      mApi()
        .communicator
        .receiveditemscount
        .cacheClear()
        .read()
        .callback(function (err, result) {
          if (result > 0) {
            $('.dock-static-navi-button-communicator .dock-notification')
              .text(result)
              .show();
          } else {
            $('.dock-static-navi-button-communicator .dock-notification')
              .hide();
          }
        });
    }
  }

  $(document).muikkuWebSocket("addEventListener", "Communicator:newmessagereceived", function () {
    reloadMessageCount();
  });
  
  $(document).muikkuWebSocket("addEventListener", "Communicator:messageread", function () {
    reloadMessageCount();
  });
  
  $(document).muikkuWebSocket("addEventListener", "Communicator:threaddeleted", function () {
    reloadMessageCount();
  });
  
  $(document).ready(function () {
    reloadMessageCount();
  });
  
  $(document).on('click', '.dock-static-navi-button-navimore', function (event) {
    if ($(this).attr('data-navmore-status') == 'open') {
      $(this).find('.navmore-container')
        .animate({
          width: '0%'
        }, {
          duration: 150,
          complete: function() {
            $(this).hide();
          }
        });
      $(this).attr('data-navmore-status', 'close');
    } else {
      $(this).find('.navmore-container')
      .show()
      .animate({
        width: '70%'
      }, {
        duration: 150,
        complete: function() {

        }
      });
      $(this).attr('data-navmore-status', 'open');
    }
    
  });
  
  
}).call(this);