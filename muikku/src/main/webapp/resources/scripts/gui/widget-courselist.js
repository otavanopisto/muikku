 
$(document).ready(function(){

    mApi().workspace.workspaces
    .read({ userId: MUIKKU_LOGGED_USER_ID })
    .callback( function (err, workspaces) {
    	
    	if( err ){
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
    	}else{
        renderDustTemplate('widgets/widget_courses.dust', {
        	
        	workspaces :  workspaces
        	
        
        }, function (text) {
            $('#widgetCourselist').append($.parseHTML(text));
          });
        
    	}
    });
    
	});

