$(document).ready(function(){
  mApi().workspace.workspaces
    .read({ userId: MUIKKU_LOGGED_USER_ID })
    .callback(function (err, workspaces) {
    	if (!err) {
    	  renderDustTemplate('frontpage/widget_workspaces.dust', {
        	isStudent: MUIKKU_LOGGED_USER.indexOf('STAFF') == -1,
          workspaces: workspaces
        },
        function (text) {
          $('#workspaces').append($.parseHTML(text));
          var is_xs = $(window).width() < 769;
          if (!is_xs) {
            $('#workspaces').perfectScrollbar({
              wheelSpeed:3,
              swipePropagation:false,
              wheelPropagation:true
            });
          }
        });
    	}
    });
});

