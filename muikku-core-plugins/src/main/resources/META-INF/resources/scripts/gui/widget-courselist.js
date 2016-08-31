 
$(document).ready(function(){

    mApi({async: false}).workspace.workspaces
    .read({ userId: MUIKKU_LOGGED_USER_ID })
    .callback( function (err, workspaces) {
    	
    	if( err ){
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
    	}else{
        renderDustTemplate('frontpage/widget_workspaces.dust', {
        	workspaces:workspaces
        }, function (text) {
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

