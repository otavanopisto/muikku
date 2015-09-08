(function() {
  'use strict';
  
  var WEEKDAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  // TODO: Validation
  // TODO: Remove internal format
  // TODO: Implement SECONDLY and MINUTELY

  $.widget("custom.recurrenceInput", {
    options : {
      rrule: '',
      texts: {
        label: 'Repeats',
        freq: {
          "SECONDLY": "Secondly",
          "MINUTELY": "Minutely",
          "DAILY": "Daily",
          "WEEKLY": "Weekly",
          "MONTHLY": "Monthly",
          "YEARLY": "Yearly"
        },
        notRepeating: "Not repeating",
        intervalLabel: 'every',
        intervalDays: 'day(s)',
        weekdaysLabel: 'Repeat on',
        intervalWeeks: 'week(s)',
        intervalMonths: 'month(s)',
        intervalYears: 'year(s)',
        recurrenceLabel: 'Ends',
        recurrenceNever: 'Never',
        recurrenceOccurrencesLabel: 'After',
        recurrenceOccurrences: 'occurrence(s)',
        recurrenceUntilLabel: "On",
        recurrenceUntil: '',
        dayNamesShort: $.datepicker.regional[''].dayNamesShort
      }
    },
    _create: function () {
      this.element.addClass('recurrence-input');
      var controlsContainer = this.element.find('.mf-textfield-subcontainer');
      var repeatebleSelect = $(":input[name='repeatable']").parent('.mf-textfield-subcontainer').find('.ca-repeatable-info');
      
      var showControlsLink = $('<a>')
        .addClass('recurrence-input-show-link')
        .attr('href', 'javascript:void(null)')
        .append($('<span>').attr("name", "humanReadableRecurrence"))
        .click($.proxy(this._onShowControlsLinkClick, this));

      var controls = $('<div>')
        .addClass('recurrence-input-controls');
      
      controls.append($('<label>').text(this.options.texts.label));
      
      var freqSelect = $('<select>')
        .attr({
          'name': 'recurrenceFreq'
        });

//    freqSelect.append($('<option>').attr('value', 'SECONDLY').text(this.options.texts.freq['SECONDLY']));
//    freqSelect.append($('<option>').attr('value', 'MINUTELY').text(this.options.texts.freq['MINUTELY']));
      freqSelect.append($('<option>').attr('value', 'DAILY').text(this.options.texts.freq['DAILY']));
      freqSelect.append($('<option>').attr('value', 'WEEKLY').text(this.options.texts.freq['WEEKLY']));
      freqSelect.append($('<option>').attr('value', 'MONTHLY').text(this.options.texts.freq['MONTHLY']));
      freqSelect.append($('<option>').attr('value', 'YEARLY').text(this.options.texts.freq['YEARLY']));
      
      controls.append(freqSelect);
      controls.append($('<div>').addClass('recurrence-input-control-details'));
      
      $('<button>')
        .text('Save')
        .click($.proxy(this._onSaveButtonClick, this))
        .appendTo(controls);
      
      $('<button>')
        .text('Cancel')
        .click($.proxy(this._onCancelButtonClick, this))
        .appendTo(controls);
      
      $('<input>')
        .attr({
          'type': 'hidden', 
          'name': 'recurrenceObject'
        })
        .val('')
        .appendTo(controls);
      
      repeatebleSelect.append(showControlsLink);
      controlsContainer.append(controls);
      
      freqSelect.change($.proxy(this._onRecurrenceFreqChange, this));
      freqSelect.keyup($.proxy(this._onRecurrenceFreqKeyUp, this));
    
      this.rrule(this.options.rrule);
    },
    
    show: function () {
      var offset = this.element.offset();      
      this.element.show();
      this._updateRecurrenceCtrl(this.val()||{freq:'DAILY'});
      this.element.trigger("show");
    },
    
    applyValues: function () {
      this.val(this._readValues());
    },
    
    hide: function () {
      this.element.hide();
      this.element.trigger("hide");
      this._refreshText();
    },
    
    rrule: function (rrule) {
      if (rrule !== undefined) {
        if (!rrule) {
          this.val(null);
        } else {
          var rule = RRule.fromString(rrule);
          var json = this._rruleToJSON(rule);
          this.val(json);
        }
      } else {
        var json = this.val();
        if (!json) {
          return null;
        }
        
        return this._jsonToRRule(json).toString();
      }
    },
    val: function (val) {
      if (val !== undefined) {
        this.element.find('input[name="recurrenceObject"]').val(val !== null ? JSON.stringify(val) : '');
        if (val) {
          this.element.find('select[name="recurrenceFreq"]').val(val.freq);
        }
        
        this._refreshText();
        this._updateRecurrenceCtrl(val||{});
      } else {
        var json = this.element.find('input[name="recurrenceObject"]').val();
        return json ? JSON.parse(json) : null;
      }
    },
    humanReadable: function () {
      var json = this.val();
      var rule = json ? this._jsonToRRule(json) : null;
      if (!rule) {
        return this.options.texts.notRepeating;
      }
      
      return rule.toText();
    },
    
    _updateRecurrenceCtrl: function(json) { 
      var recurrenceControls = this.element.find('.recurrence-input-control-details');
      recurrenceControls.empty();
      switch (json.freq) {
        case "DAILY":
          this._buildDailyCtrls(recurrenceControls, json.freq, json.interval, json.count, json.until);
        break;
        case "WEEKLY":
          this._buildWeeklyCtrls(recurrenceControls, json.freq, json.interval, json.count, json.until, json.weekdays);
        break;
        case "MONTHLY":
          this._buildMonthlyCtrls(recurrenceControls, json.freq, json.interval, json.count, json.until, json.monthDay);
        break;
        case "YEARLY":
          this._buildYearlyCtrls(recurrenceControls, json.freq, json.interval, json.count, json.until, json.monthDay, json.month);
        break;
      }
    },
    
    _buildIntervalCtrls: function (value, label) {
      var interval = $('<div>').addClass('recurrence-input-interval');
      
      var intervalInput = $('<input>')
        .attr({
          'name': "recurrenceInterval",
          'type': "number",
          'min': '1',
          'required': 'required'
        })
        .addClass('recurrence-input-interval-input')
        .val(value||1);
        
      interval.append($('<label>').text(this.options.texts.intervalLabel));
      interval.append(intervalInput);
      interval.append($('<span>').text(label));
      
      return interval;
    },
    
    _buildDailyCtrls: function (recurrenceControls, freq, interval, count, until) {
      recurrenceControls.append(this._buildIntervalCtrls(interval, this.options.texts.intervalDays));
      recurrenceControls.append(this._buildRecurrenceCtrls(freq, count, until));
    },

    _buildWeeklyCtrls: function (recurrenceControls, freq, interval, count, until, weekdays) {
      recurrenceControls.append(this._buildIntervalCtrls(interval, this.options.texts.intervalWeeks));
      recurrenceControls.append($('<label>').text(this.options.texts.weekdaysLabel));
      
      var container = $('<div>').addClass('recurrence-input-weekdays');
      
      for (var i = 0; i < 6; i++) {
        var code = WEEKDAYS[i];
        var short = this.options.texts.dayNamesShort[i];
        
        var weekdayInput = $('<input>')
          .attr({
            'name': "recurrenceInputWeekday",
            'data-value': code,
            'type': 'checkbox',
            'data-serialize': 'false'
          });
        
        if ($.isArray(weekdays) && (weekdays.indexOf(code) != -1)) {
          weekdayInput.attr("checked", "checked");
        }
        
        container.append($('<span>').text(short));
        container.append(weekdayInput);
      }
      
      recurrenceControls.append(container);
      recurrenceControls.append(this._buildRecurrenceCtrls(freq, count, until));
    },
    
    _buildMonthlyCtrls: function (recurrenceControls, freq, interval, count, until, monthDay) {
      recurrenceControls.append(this._buildIntervalCtrls(interval, this.options.texts.intervalMonths));
      recurrenceControls.append(this._buildRecurrenceCtrls(freq, count, until));
    },
    
    _buildYearlyCtrls: function (recurrenceControls, freq, interval, count, until, monthDay, month) {
      recurrenceControls.append(this._buildIntervalCtrls(interval, this.options.texts.intervalYears));
      recurrenceControls.append(this._buildRecurrenceCtrls(freq, count, until));
    },
    
    _buildRecurrenceCtrls: function (freq, count, until) {
      var recurrence = $('<div>').addClass('recurrence-input-recurrence');
      recurrence.append($('<label>').text(this.options.texts.recurrenceLabel));
      
      var neverRadio = $('<input>')
        .attr({
          'type': "radio",
          'name': "endRecurrence",
          'data-value': ''
        });
      
      var countRadio = $('<input>')
        .attr({
          'type': "radio",
          'name': "endRecurrence",
          'data-value': 'count'
        });
      
      var untilRadio = $('<input>')
        .attr({
          'type': "radio",
          'name': "endRecurrence",
          'data-value': 'until'
        });
      
      if (count) {
        countRadio.attr('checked', 'checked');
      } else if (until) {
        untilRadio.attr('checked', 'checked');
      } else {
        neverRadio.attr('checked', 'checked');
     }
      
      var countInput = $('<input>').attr({
        'type': 'number',
        'name': 'recurrenceCount',
        'min': '1'
       }).val(count||'');
      
      var untilInput = $('<input>')
        .attr({
          'type': 'date',
          'name': 'recurrenceUntil'
        }).datepicker();
      
      if (until) {
        untilInput.datepicker('setDate', new Date(Date.parse(until)));
      }
      
      var never = $('<div>')
        .addClass('recurrenceInput-event-recurrence-select')
        .append(neverRadio);

      if (this.options.texts.recurrenceNever) {
        never.append($('<span>').text(this.options.texts.recurrenceNever))
      }
      
      var occurrences = $('<div>')
        .addClass('recurrenceInput-event-recurrence-select')
        .append(countRadio);
      
      if (this.options.texts.recurrenceOccurrencesLabel) {
        occurrences.append($('<span>').text(this.options.texts.recurrenceOccurrencesLabel));
      }
      
      occurrences.append(countInput);
       
      if (this.options.texts.recurrenceOccurrences) {
        occurrences.append($('<span>').text(this.options.texts.recurrenceOccurrences));
      }
      
      var until = $('<div>')
        .addClass('recurrenceInput-event-recurrence-select')
        .append(untilRadio);
      
      if (this.options.texts.recurrenceUntilLabel) {
        until.append($('<span>').text(this.options.texts.recurrenceUntilLabel));
      }
      
      until.append(untilInput);

      if (this.options.texts.recurrenceUntil) {
        until.append($('<span>').text(this.options.texts.recurrenceUntil));
      }
      
      recurrence.append(never);
      recurrence.append(occurrences);
      recurrence.append(until);
      
      return recurrence;
    },
    
    _refreshText: function () {
      var txContainer = $(":input[name='repeatable']").parent('.mf-textfield-subcontainer');
      
      txContainer.find('span[name="humanReadableRecurrence"]').text(this.humanReadable());
    },
    
    _jsonToRRule: function (json) {
      var opts = {};

      if (json.freq !== undefined) {
        opts.freq = RRule[json.freq];
      }
      
      if (json.interval !== undefined) {
        opts.interval = json.interval;
      }

      if (json.count !== undefined) {
        opts.count = json.count;
      }
      
      if (json.until !== undefined) {
        opts.until = new Date(Date.parse(json.until));
      }
      
      if (json.weekdays !== undefined) {
        opts.byweekday = $.map(json.weekdays, function (weekday) {
          return RRule[weekday];
        });
      }
      
      return new RRule(opts);
    },
    
    _rruleToJSON: function (rrule) {
      var json = {};
      
      if (rrule.options.freq !== undefined) {
        json.freq = RRule.FREQUENCIES[rrule.options.freq];
      }
      
      json.interval = rrule.options.interval;
      json.count = rrule.options.count;
      
      if ((typeof rrule.options.until) == 'date') {
        json.until = rrule.options.until.toISOString();
      }
      
      if ($.isArray(rrule.options.byweekday)) {
        json.weekdays = $.map(rrule.options.byweekday, function (weekday) {
          return WEEKDAYS[weekday];
        });
      }
      
      return json;
    },
    
    _readValues: function () {
      var recurrence = {};
      recurrence.freq = this.element.find('select[name="recurrenceFreq"]').val();
      recurrence.interval = this.element.find('input[name="recurrenceInterval"]').val();
      
      var _this = this;
      this.element.find('input[name="endRecurrence"]').each(function(){
        if($(this).is(':checked')){
          if($(this).data('value') !== "") {
            var endType = $(this).data('value');
            switch (endType) {
            case "count":
              recurrence.count = _this.element.find('input[name="recurrenceCount"]').val();
              break;
            case "until":
              recurrence.until = _this.element.find('input[name="recurrenceUntil"]').datepicker("getDate");
              break;
            }
          }
        }
      });
    
      var weekdays = [];
      this.element.find('input[name="recurrenceInputWeekday"]').each(function(){
        if($(this).is(':checked')){
          weekdays.push($(this).data('value'));
        }
      });
      
      if(weekdays.length > 0){
        recurrence.weekdays = weekdays;
      }
      
      return recurrence;
    },
    
    _onSaveButtonClick: function(e) {
      e.preventDefault();
      this.applyValues();
      this.element.hide();
    },
    
    _onCancelButtonClick: function (event) {
      event.preventDefault();
      this.element.hide();
    },
    
    _onRecurrenceFreqChange: function (event) {
      this._updateRecurrenceCtrl(this._readValues());
    },

    _onRecurrenceFreqKeyUp: function (event) {
      this._updateRecurrenceCtrl(this._readValues());
    },
    
    _onShowControlsLinkClick: function (event) {
      event.preventDefault();
      this.element.show();
    },
    
    _destroy: function () {
      this.element
        .empty()
        .removeClass('recurrence-input');
    }
  });

}).call(this);