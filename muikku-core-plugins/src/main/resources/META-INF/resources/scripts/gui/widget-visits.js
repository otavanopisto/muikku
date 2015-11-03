 
$(document).ready(function(){
    

	
	
    mApi().workspace.workspaces
    .read({ minVisits: 1, orderBy: "lastVisit" }).on('$', function(workspace, workspaceCallback){

    	 var td = new Date();
    	 
    	 // 1 h == 3600 seconds 
    	  
    	 var dayScs =  24 * 3600;
    	 var weekScs = (24 * 3600) * 7;
 
    	 
    	// Turning timestamps (visited, now) from milliseconds to seconds 
    	 
       	 var visitScs = eval(workspace.lastVisit / 1000); 
    	 var nowScs = eval(td.getTime() / 1000);
       
        // Defining the last day and last week startpoints	 
    	 
    	 var lDaySec = eval(nowScs - dayScs);
    	 var lWeekSec = eval(nowScs - weekScs);
    	 
       // Visit day daystamp to date
    	 
    	 var vdt = new Date(visitScs);
       
    	 
      // Comparing visitday to last day and week startpoints 
    	 
    	 if(visitScs > lDaySec){
   		  workspace.lastDay = true;		 
    	 }else if(visitScs > lWeekSec){
      	  workspace.lastWeek = true;    		 
       	 }
    	 
     // Setting date to String 
    	 
 		  workspace.trueDat = vdt.toDateString();
 		  workspaceCallback();
    	
 		  
 		 
    })
    .callback( function (err, workspaces) {
    	
    	if( err ){
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
    	}else{
    		
     // Empty arrays foe visiting time categories to present to the dust templates
    		
		var lastDay = [];
		var lastWeek = [];
		var older = []	

		
		if(workspaces != null){
    		
	     	for (var i = 0, l = workspaces.length; i < l; i++) {
	     	  var ld = workspaces[i].lastDay;
	     	  var lw = workspaces[i].lastWeek;
	     	  
	    // sorting the given workspaces into said categories     
	     	  
	
	     	  
	     	   if( ld == true ){
	     		var ldl = lastDay.length; 
	     		lastDay[ldl] = workspaces[i];
	     	   }else if( lw == true ){
	     	     var lwl = lastWeek.length;
	        	 lastWeek[lwl] = workspaces[i];     			 
	     	   }else{
	     		 var ol = older.length;
	        	 older[ol] = workspaces[i];     			 
	        	 }
	     	   
	          
	     	}    		
     	
		}

    	renderDustTemplate('frontpage/widget_visits.dust', {
        	
        	workspaces :  workspaces,
            lastDay : lastDay,
        	lastWeek : lastWeek,
        	older : older
             
        }, function (text) {
            $('#widgetVisits').append($.parseHTML(text));
          });
        
    	}
    });
    
	});

