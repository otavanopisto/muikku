 
$(document).ready(function(){

    mApi({async: false}).workspace.workspaces
    .read({ userId: MUIKKU_LOGGED_USER_ID })
    .callback( function (err, workspaces) {
    	
    	if( err ){
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
    	}else{
        renderDustTemplate('frontpage/widget_workspaces.dust', {
        	
        	workspaces :  workspaces
        	
        
        }, function (text) {
            $('#widgetCourselist').append($.parseHTML(text));
          });
        
    	}
    });
    
	});

