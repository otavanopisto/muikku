 
 function openInSN(template){
	var functionContainer = $('.sn-container');
	var formContainer = $('#mainfunctionFormTabs'); 
    var openTabs = formContainer.children().length;    	
    var tabDiv = $("<div class='mf-form-tab' id='mainfunctionFormTab-" + eval(openTabs + 1) + "'>");
    
    tabDiv.appendTo(formContainer);
    
    mApi().forum.areas.read()
      .callback(function (err, result) {
      	if( err ){
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('TODO: Virheilmoitus', err));
    	}else{    	  
	      renderDustTemplate(template, result, function (text) {
	        $(tabDiv).append($.parseHTML(text));
	      });
    	}
    });
 
   functionContainer.removeClass('closed');
   functionContainer.addClass('open');
 
 }
