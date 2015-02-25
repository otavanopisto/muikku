


 function openInSN(template){
	var functionContainer = $('.sn-container');
	var formContainer = $('#mainfunctionFormTabs'); 
	 
    // temporary solution for removing existing tabs --> TODO: TABBING
    
    formContainer.empty();
	 


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
	        
	        var cancelBtn = $(tabDiv).find("input[name='cancel']");

	        cancelBtn.on("click", cancelBtn, function(){
               formContainer.empty();
	     	   $('.sn-container').removeClass('open');
	     	   $('.sn-container').addClass('closed');
	     	   
	        });
	        
	      });
    	}
    });
 
   functionContainer.removeClass('closed');
   functionContainer.addClass('open');
 
 }
 
