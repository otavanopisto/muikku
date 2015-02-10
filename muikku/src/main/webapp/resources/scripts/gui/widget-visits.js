 
$(document).ready(function(){

    mApi().workspace.workspaces
    .read({ minVisits: 1, orderBy: "lastVisit" })
    .callback( function (err, workspaces) {
    	
    	if( err ){
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
    	}else{
        renderDustTemplate('frontpage/widget_visits.dust', {
        	
        	workspaces :  workspaces
        	
        
        }, function (text) {
            $('#widgetVisits').append($.parseHTML(text));
          });
        
    	}
    });
    
	});

