


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
		var inputs = $(tabDiv).find("input:not([type='button'])");
		

		
		
		cancelBtn.on("click", cancelBtn, function() {
			formContainer.empty();
			$('.sn-container').removeClass('open');
			$('.sn-container').addClass('closed');

		});

		sendBtn.on("click", sendBtn, function() {
			var values = inputs.serializeArray()
			var obj = {};
			$.each(values, function(value){
				
				obj[value.name] = value.value || '';
				
			});
			
			var stringObj = JSON.stringify(obj);
			
			formFunction(stringObj);
			
			$('.sn-container').removeClass('open');
			$('.sn-container').addClass('closed');

		});		
		
	});

   functionContainer.removeClass('closed');
   functionContainer.addClass('open');
 
 }
 
