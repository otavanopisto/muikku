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
			    '<label for="new-event-recurrence-list">Repeats:</label>' +
		        '<div id="recurrenceInput-event-recurrence-list">' +
		        '<p><span name="humanReadableRecurrence">Not repeating</span><button name="showRecurrenceControls">Add</button></p>' +
		        '</div>' +
		        '<!-- TODO: Make more suitable for humans -->' +
		        '<div style="display:none;" name="recurrenceControls" id="new-event-recurrence-controls" >' +
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
		
	    this.find('button[name="showRecurrenceControls"]').click(function(e){
	    	e.preventDefault();
	    	_this.find('div[name="recurrenceControls"]').show();
	    	_this._updateRecurrenceCtrl(_this.find('select[name="recurrenceFreq"]').val());
	    });
	    this.find('button[name="saveRecurrence"]').click(function(e){
	    	e.preventDefault();
			var recurrence = {};
			recurrence.freq = _this.find('select[name="recurrenceFreq"]').val();
			recurrence.interval = _this.find('input[name="recurrenceInterval"]').val();
			_this.find('input[name="endRecurrence"]').each(function(){
				if($(this).is(':checked')){
					if($(this).val() !== ""){
						var endType = $(this).val();
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
					weekdays.push($(this).val());
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
			
	    });
	    this.find('button[name="cancelRecurrence"]').click(function(e){
	    	e.preventDefault();
	    	_this.find('div[name="recurrenceControls"]').hide();
	    });
	    
	    this.find('select[name="recurrenceFreq"]').change(function (events) {
	    	var recurFreq = $(this).val();
	    	_this._updateRecurrenceCtrl(recurFreq);
	    });
		
	    this._generatehumanReadableRecurrence = function(recurrence){ //TODO: make better, localize
	    	var recurrenceString = "Repeating every ";
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
		    		recurrenceString += " on: ";
		    		for(var i = 0; i < recurrence.weekdays.length;i++){
		    			recurrenceString += ","+recurrence.weekdays[i];
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
	        	        '<input type="radio" name="endRecurrence" value="" />Never<br/>' +
	        	        '<input type="radio" name="endRecurrence" value="count" />After: <input style="width:15%;" id="recurrenceInput-event-recurrence-count" type="text" name="recurrenceCount" /> occurrence(s)<br/>' +
	        	        '<input type="radio" name="endRecurrence" value="until" />On: <input style="width:20%;" id="recurrenceInput-event-recurrence-until" type="text" name="recurrenceUntil" />'
	        	);
	            break;
	        case "WEEKLY":
	        	recurrenceControls.append(
	        			'<span><b>Repeat every:</b>&nbsp;</span>' +
	        	        '<input style="width:15%;" id="recurrenceInput-event-recurrence-interval" name="recurrenceInterval" type="text" /><span>&nbsp;weeks.</span><br/>' +
	        	        '<span><b>Repeat On:</b>&nbsp;</span>' +
	        			'<div class="recurrenceWeekdays"><span>Mon:&nbsp;</span><input name="recurrenceweekdayMO" value="MONDAY" type="checkbox">' +
	        			'<span>Tue:&nbsp;</span><input name="recurrenceInput-weekday" value="TUESDAY" type="checkbox">' +
	        			'<span>Wed:&nbsp;</span><input name="recurrenceInput-weekday" value="WEDNESDAY" type="checkbox">' +
	        			'<span>Thu:&nbsp;</span><input name="recurrenceInput-weekday" value="THURSDAY" type="checkbox">' +
	        			'<span>Fri:&nbsp;</span><input name="recurrenceInput-weekday" value="FRIDAY" type="checkbox">' +
	        			'<span>Sat:&nbsp;</span><input name="recurrenceInput-weekday" value="SATURDAY" type="checkbox">' +
	        	        '<span>Sun:&nbsp;</span><input name="recurrenceInput-weekday" value="SUNDAY" type="checkbox"></div>' + 
	        	        '<span><b>End recurrence:</b></span><br/>'+
	        	        '<input type="radio" name="endRecurrence" value="" />Never<br/>' +
	        	        '<input type="radio" name="endRecurrence" value="count" />After: <input style="width:15%;" id="recurrenceInput-event-recurrence-count" type="text" name="recurrenceCount" /> occurrence(s)<br/>' +
	        	        '<input type="radio" name="endRecurrence" value="until" />On: <input style="width:20%;" id="recurrenceInput-event-recurrence-until" type="text" name="recurrenceUntil" />'
	        	);
	            break;
	        case "MONTHLY":
	        	recurrenceControls.append(
	        			'<span><b>Repeat every:</b>&nbsp;</span>' +
	        	        '<input style="width:15%;" id="new-event-recurrence-interval" name="recurrenceInterval" type="text" /><span>&nbsp;months.</span><br/>' +
	        	        '<span><b>Repeat on:</b><br/>Day of the month:</span><input style="width:15%;"name="recurrenceMonthDay" type="text" /><span>&nbsp;(1 - 31)</span><br/>' +
	        	        '<span><b>End recurrence:</b></span><br/>'+
	        	        '<input type="radio" name="endRecurrence" value="" />Never<br/>' +
	        	        '<input type="radio" name="endRecurrence" value="count" />After: <input style="width:15%;" id="recurrenceInput-event-recurrence-count" type="text" name="recurrenceCount" /> occurrence(s)<br/>' +
	        	        '<input type="radio" name="endRecurrence" value="until" />On: <input style="width:20%;" id="recurrenceInput-event-recurrence-until" type="text" name="recurrenceUntil" />'
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
	        	        '<input type="radio" name="endRecurrence" value="" />Never<br/>' +
	        	        '<input type="radio" name="endRecurrence" value="count" />After: <input style="width:15%;" id="recurrenceInput-event-recurrence-count" type="text" name="recurrenceCount" /> occurrence(s)<br/>' +
	        	        '<input type="radio" name="endRecurrence" value="until" />On: <input style="width:20%;" id="recurrenceInput-event-recurrence-until" type="text" name="recurrenceUntil" />'
	        	);
	            break;
	    	}
	    	_this.find('input[name="recurrenceUntil"]').datepicker();
	    }
	}
	return this;
	};
}( jQuery ));