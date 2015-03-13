(function ( $ ) {
	$.fn.recurrenceInput = function(action, value) {
		
	var _this = this;
	
	if(action){
		if(action === 'getRecurrence') {
			return JSON.parse(_this.find('input[name="recurrenceObject"]').val());
		}else if(action === 'setRecurrence'){
			//TODO: validate
			_this.find('input[name="recurrenceObject"]').val(JSON.stringify(value));
			_this._generatehumanReadableRecurrence(value);
		}
	} else {
		this.append(
		        '<a data-name="showRecurrenceControls" style="text-decoration:underline !important;cursor:pointer !important;" ><span name="humanReadableRecurrence">Not repeating</span></a>' +
		        '</div>' +
		        '<!-- TODO: Make more suitable for humans -->' +
		        '<div style="display:none;background-color:#FFF !important;color:#000 !important; position:fixed !important;border: 1px solid #DDD;padding:15px;" name="recurrenceControls" id="new-event-recurrence-controls" >' +
		        '<span><b>Repeat:</b></span><select id="recurrenceInput-event-recurrence-freq" name="recurrenceFreq">' +
		        '<!-- <option value="SECONDLY">SECONDLY</option> TODO: Add support -->' +
		        '<!-- <option value="MINUTELY">MINUTELY</option> TODO: Add support -->' +
		        '<option value="DAILY">DAILY</option>' +
		        '<option value="WEEKLY">WEEKLY</option>' +
		        '<option value="MONTHLY">MONTHLY</option>' +
		        '<option value="YEARLY">YEARLY</option>' +
		        '</select>' +
		        '<div name="recurrenceControlDetails">' +
		        '</div>' +
		        '<button name="saveRecurrence">Save</button><button name="cancelRecurrence">Cancel</button>' +
		        '<input type="hidden" value="" name="recurrenceObject" />' +
		        '</div>'
		);
		
		  this.find('div[name="recurrenceControls"]').blur(function(e){
		    console.log('blur');
		    $(this).hide();
		  });
		
	    this.find('a[data-name="showRecurrenceControls"]').click(function(e){
	    	e.preventDefault();
	    	_this.find('div[name="recurrenceControls"]').show();
	    	var offset = _this.offset();
	    	_this.find('div[name="recurrenceControls"]').css({'top':offset.top, 'left':offset.left});
	    	_this._updateRecurrenceCtrl(_this.find('select[name="recurrenceFreq"]').val());
	    });
	    
	    this.find('button[name="saveRecurrence"]').click(function(e){
	    	e.preventDefault();
  			var recurrence = {};
  			recurrence.freq = _this.find('select[name="recurrenceFreq"]').val();
  			recurrence.interval = _this.find('input[name="recurrenceInterval"]').val();
  			_this.find('input[name="endRecurrence"]').each(function(){
  				if($(this).is(':checked')){
  					if($(this).data('value') !== ""){
  						var endType = $(this).data('value');
  						switch (endType) {
  						case "count":
  							recurrence.count = _this.find('input[name="recurrenceCount"]').val();
  							break;
  						case "until":
  							recurrence.until = _this.find('input[name="recurrenceUntil"]').datepicker("getDate");
  							break;
  						}
  					}
  				}
  			});
  			var weekdays = [];
  			_this.find('input[name="recurrenceInput-weekday"]').each(function(){
  				if($(this).is(':checked')){
  					weekdays.push($(this).data('value'));
  				}
  			});
  			if(weekdays.length > 0){
  				recurrence.weekdays = weekdays;
  			}
  			if(_this.find('input[name="recurrenceMonthDay"]').length > 0){
  				recurrence.monthDay = _this.find('input[name="recurrenceMonthDay"]').val();
  			}
  			if(_this.find('select[name="recurrenceMonth"]').length > 0){
  				recurrence.month = _this.find('select[name="recurrenceMonth"]').val();
  			}
  			_this._generatehumanReadableRecurrence(recurrence);
  			_this.find('input[name="recurrenceObject"]').val(JSON.stringify(recurrence));
  			_this.find('div[name="recurrenceControls"]').hide();
	    });
	    
	    this.find('button[name="cancelRecurrence"]').click(function(e){
	    	e.preventDefault();
	    	_this.find('input[name="recurrenceObject"]').val('');
	    	_this.find('span[name="humanReadableRecurrence"]').text('Not repeating');
	    	_this.find('div[name="recurrenceControls"]').hide();
	    });
	    
	    this.find('select[name="recurrenceFreq"]').change(function (events) {
	    	var recurFreq = $(this).val();
	    	_this._updateRecurrenceCtrl(recurFreq);
	    });
		
	    this._generatehumanReadableRecurrence = function(recurrence){ //TODO: make better, localize
	    	var recurrenceString = "Repeating ";
	        if(typeof(recurrence.count) !== 'undefined'){
	          recurrenceString += recurrence.count+' times';
	        }
	    	recurrenceString += " every ";
	    	var many = false;
	    	if(recurrence.interval > 1){
	    		many = true;
	    		recurrenceString += recurrence.interval+" ";
	    	}
	    	switch (recurrence.freq){
	    	case "DAILY":
	    		recurrenceString += "day";
		    	if(many){
		    		recurrenceString += "s";
		    	}
	    		break;
	    	case "WEEKLY":
	    		recurrenceString += "week";
		    	if(many){
		    		recurrenceString += "s";
		    	}
		    	if(recurrence.weekdays){
		    		recurrenceString += " on ";
		    		for(var i = 0; i < recurrence.weekdays.length;i++){
		    		  if(i == 0){
		    		    recurrenceString += recurrence.weekdays[i].toLowerCase();
		    		  }else if(i > 0 && i < (recurrence.weekdays.length - 1)){
		    		    recurrenceString += ","+recurrence.weekdays[i].toLowerCase();
		    		  }else{
		    		    recurrenceString += " and "+recurrence.weekdays[i].toLowerCase();
		    		  }
		    			
		    		}
		    	}
	    		break;
	    	case "MONTHLY":
	    		recurrenceString += "month";
		    	if(many){
		    		recurrenceString += "s";
		    	}
		    	if(recurrence.monthDay){
		    		var monthDay = "";
		    		if(recurrence.monthDay == 1){
		    			monthDay = recurrence.monthDay+"st";
		    		}else if(recurrence.monthDay == 2){
		    			monthDay = recurrence.monthDay+"nd";
		    		}else if(recurrence.monthDay == 3){
		    			monthDay = recurrence.monthDay+"rd";
		    		}else{
		    			monthDay = recurrence.monthDay+"th";
		    		}
		    		recurrenceString += " on "+monthDay+" day of the month";
		    	}
	    		break;
	    	case "YEARLY":
	    		recurrenceString += "year";
		    	if(many){
		    		recurrenceString += "s ";
		    	}
		    	if(recurrence.month) {
		    		recurrenceString += " on "+recurrence.monthDay+"."+recurrence.month;
		    	}
	    		break;
	    	}
	      if(typeof(recurrence.until) !== 'undefined'){
	        recurrenceString += ' until '+new Date(recurrence.until).toLocaleString();
	    	}
	    	
	    	_this.find('span[name="humanReadableRecurrence"]').text(recurrenceString);
	    	
	    }
	    
	    this._updateRecurrenceCtrl = function(freq) { //TODO: Add missing options
	    	var recurrenceControls = _this.find('div[name="recurrenceControlDetails"]');
	    	recurrenceControls.empty();
	    	switch (freq) {
	        case "DAILY":
	        	recurrenceControls.append(
	        			'<span><b>Repeat every:</b>&nbsp;</span>' +
	        	        '<input style="width:15%;" id="recurrenceInput-event-recurrence-interval" name="recurrenceInterval" type="text" /><span>&nbsp;days.</span><br/>' +
	        	        '<span><b>End recurrence:</b></span><br/>'+
	        	        '<input type="radio" name="endRecurrence" data-value="" />Never<br/>' +
	        	        '<input type="radio" name="endRecurrence" data-value="count" />After: <input style="width:15%;" id="recurrenceInput-event-recurrence-count" type="text" name="recurrenceCount" /> occurrence(s)<br/>' +
	        	        '<input type="radio" name="endRecurrence" data-value="until" />On: <input style="width:20%;" id="recurrenceInput-event-recurrence-until" type="text" name="recurrenceUntil" />'
	        	);
	            break;
	        case "WEEKLY":
	        	recurrenceControls.append(
	        			'<span><b>Repeat every:</b>&nbsp;</span>' +
	        	        '<input style="width:15%;" id="recurrenceInput-event-recurrence-interval" name="recurrenceInterval" type="text" /><span>&nbsp;weeks.</span><br/>' +
	        	        '<span><b>Repeat On:</b>&nbsp;</span>' +
	        			'<div class="recurrenceWeekdays">' +
	        	    '<span>Mon:&nbsp;</span><input name="recurrenceInput-weekday" data-value="MONDAY" type="checkbox" />' +
	        			'<span>Tue:&nbsp;</span><input name="recurrenceInput-weekday" data-value="TUESDAY" type="checkbox" />' +
	        			'<span>Wed:&nbsp;</span><input name="recurrenceInput-weekday" data-value="WEDNESDAY" type="checkbox" />' +
	        			'<span>Thu:&nbsp;</span><input name="recurrenceInput-weekday" data-value="THURSDAY" type="checkbox" />' +
	        			'<span>Fri:&nbsp;</span><input name="recurrenceInput-weekday" data-value="FRIDAY" type="checkbox" />' +
	        			'<span>Sat:&nbsp;</span><input name="recurrenceInput-weekday" data-value="SATURDAY" type="checkbox" />' +
	        	        '<span>Sun:&nbsp;</span><input name="recurrenceInput-weekday" value="SUNDAY" type="checkbox"></div>' + 
	        	        '<span><b>End recurrence:</b></span><br/>'+
	        	        '<input type="radio" name="endRecurrence" data-value="" />Never<br/>' +
	        	        '<input type="radio" name="endRecurrence" data-value="count" />After: <input style="width:15%;" id="recurrenceInput-event-recurrence-count" type="text" name="recurrenceCount" /> occurrence(s)<br/>' +
	        	        '<input type="radio" name="endRecurrence" data-value="until" />On: <input style="width:20%;" id="recurrenceInput-event-recurrence-until" type="text" name="recurrenceUntil" />'
	        	);
	            break;
	        case "MONTHLY":
	        	recurrenceControls.append(
	        			'<span><b>Repeat every:</b>&nbsp;</span>' +
	        	        '<input style="width:15%;" id="new-event-recurrence-interval" name="recurrenceInterval" type="text" /><span>&nbsp;months.</span><br/>' +
	        	        '<span><b>Repeat on:</b><br/>Day of the month:</span><input style="width:15%;"name="recurrenceMonthDay" type="text" /><span>&nbsp;(1 - 31)</span><br/>' +
	        	        '<span><b>End recurrence:</b></span><br/>'+
	        	        '<input type="radio" name="endRecurrence" data-value="" />Never<br/>' +
	        	        '<input type="radio" name="endRecurrence" data-value="count" />After: <input style="width:15%;" id="recurrenceInput-event-recurrence-count" type="text" name="recurrenceCount" /> occurrence(s)<br/>' +
	        	        '<input type="radio" name="endRecurrence" data-value="until" />On: <input style="width:20%;" id="recurrenceInput-event-recurrence-until" type="text" name="recurrenceUntil" />'
	        	);
	            break;
	        case "YEARLY":
	        	recurrenceControls.append(
	        			'<span><b>Repeat every:</b>&nbsp;</span>' +
	        	        '<input style="width:15%;" id="new-event-recurrence-interval" name="recurrenceInterval" type="text" /><span>&nbsp;years.</span><br/>' +
	        	        '<span><b>Repeat on:</b><br/>Every:</span><select name="recurrenceMonth" >' +
						'<option value="1">January</option>' +  
						'<option value="2">February</option>' +  
						'<option value="3">March</option>' +  
						'<option value="4">April</option>' +
						'<option value="5">May</option>' +
						'<option value="6">June</option>' +
						'<option value="7">July</option>' +
						'<option value="8">August</option>' +
						'<option value="9">September</option>' +
						'<option value="10">October</option>' +
						'<option value="11">November</option>' +
						'<option value="12">December</option> ' +
						'</select><input style="width:15%;"name="recurrenceMonthDay" type="text" /><span>&nbsp;(1 - 31)</span><br/>' +
						'<span><b>End recurrence:</b></span><br/>'+
	        	        '<input type="radio" name="endRecurrence" data-value="" />Never<br/>' +
	        	        '<input type="radio" name="endRecurrence" data-value="count" />After: <input style="width:15%;" id="recurrenceInput-event-recurrence-count" type="text" name="recurrenceCount" /> occurrence(s)<br/>' +
	        	        '<input type="radio" name="endRecurrence" data-value="until" />On: <input style="width:20%;" id="recurrenceInput-event-recurrence-until" type="text" name="recurrenceUntil" />'
	        	);
	            break;
	    	}
	    	_this.find('input[name="recurrenceUntil"]').datepicker();
	    }
	}
	return this;
	};
}( jQuery ));