


 function openInSN(template, result, formFunction){
	var functionContainer = $('.sn-container');
	var formContainer = $('#mainfunctionFormTabs'); 
	 
    // temporary solution for removing existing tabs --> TODO: TABBING
    
    formContainer.empty();
	 


    var openTabs = formContainer.children().length;    	
    var tabDiv = $("<div class='mf-form-tab' id='mainfunctionFormTab-" + eval(openTabs + 1) + "'>");
    

    
    tabDiv.appendTo(formContainer);
       	  

	  renderDustTemplate(template, result, function(text) {
		$(tabDiv).append($.parseHTML(text));

		var cancelBtn = $(tabDiv).find("input[name='cancel']");
		var sendBtn = $(tabDiv).find("input[name='send']");		
		var elements = $(tabDiv).find("form");
       
		
		
		cancelBtn.on("click", cancelBtn, function() {
			formContainer.empty();
			$('.sn-container').removeClass('open');
			$('.sn-container').addClass('closed');

		});

		sendBtn.on("click", sendBtn, function() {
			var valz = elements.serializeArray();
			var obj = {};
			$.each(valz, function(index,value){
				
				obj[value.name] = value.value || '';
				
			});
			
			
			formFunction(obj);
			
			$('.sn-container').removeClass('open');
			$('.sn-container').addClass('closed');

		});		
		
	});

   functionContainer.removeClass('closed');
   functionContainer.addClass('open');
 
 }
 
