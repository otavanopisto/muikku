 
$(document).ready(function(){

    mApi().workspace.workspaces
    .read({ userId: MUIKKU_LOGGED_USER_ID })
    .callback( function (err, workspaces) {
        renderDustTemplate('widgets/widget_courses.dust', workspaces, function (text) {
            $('#widgetCourselist').append($.parseHTML(text));
          });
    });
    
	});

