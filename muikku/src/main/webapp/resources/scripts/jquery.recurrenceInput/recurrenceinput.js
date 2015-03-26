(function() {
  'use strict';
  
  var WEEKDAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  // TODO: Localize
  // TODO: Validation
  // TODO: Remove internal format
  
  $.widget("custom.recurrenceInput", {
    options : {
      rrule: ''
    },
    _create: function () {
      this.element.addClass('recurrence-input');
      
      var showControlsLink = $('<a>')
        .addClass('recurrence-input-show-link')
        .attr('href', 'javascript:void(null)')
        .append($('<span>').attr("name", "humanReadableRecurrence"))
        .click($.proxy(this._onShowControlsLinkClick, this));

      var controls = $('<div>')
        .addClass('recurrence-input-controls')
        .hide();
      
      controls.append(
        $('<label>')
          .text('Repeat:')
     );
      
      var freqSelect = $('<select>')
        .attr({
          'name': 'recurrenceFreq'
        });

//      TODO: Implement SECONDLY and MINUTELY
//      freqSelect.append($('<option>').attr('value', 'SECONDLY').text('SECONDLY'));
//      freqSelect.append($('<option>').attr('value', 'MINUTELY').text('MINUTELY'));
      freqSelect.append($('<option>').attr('value', 'DAILY').text('DAILY'));
      freqSelect.append($('<option>').attr('value', 'WEEKLY').text('WEEKLY'));
      freqSelect.append($('<option>').attr('value', 'MONTHLY').text('MONTHLY'));
      freqSelect.append($('<option>').attr('value', 'YEARLY').text('YEARLY'));
      
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
      
      this.element.append(showControlsLink);
      this.element.append(controls);
      
      freqSelect.change($.proxy(this._onRecurrenceFreqChange, this));
      freqSelect.keyup($.proxy(this._onRecurrenceFreqKeyUp, this));
    
      this.rrule(this.options.rrule);
    },
    
    show: function () {
      var offset = this.element.offset();      
      this.element.find('.recurrence-input-controls').show();
      this._updateRecurrenceCtrl(this.val()||{freq:'DAILY'});
      this.element.trigger("show");
    },
    
    applyValues: function () {
      this.val(this._readValues());
    },
    
    hide: function () {
      this.element.find('.recurrence-input-controls').hide();
      this.element.trigger("hide");
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
        return "Not repeating";
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
        
      interval.append(
        $('<label>')
          .text('Repeat every:')
      );
      interval.append(intervalInput);
      interval.append($('<span>').text(label));
      
      return interval;
    },
    
    _buildDailyCtrls: function (recurrenceControls, freq, interval, count, until) {
      recurrenceControls.append(this._buildIntervalCtrls(interval, 'day(s)'));
      recurrenceControls.append(this._buildRecurrenceCtrls(freq, count, until));
    },

    _buildWeeklyCtrls: function (recurrenceControls, freq, interval, count, until, weekdays) {
      recurrenceControls.append(this._buildIntervalCtrls(interval, 'week(s)'));
      recurrenceControls.append($('<label>').text('Repeat on:'));
      
      var container = $('<div>').addClass('recurrence-input-weekdays');
      
      for (var i = 0; i < 6; i++) {
        var code = WEEKDAYS[i];
        var short = $.datepicker.regional[''].dayNamesShort[i];
        
        var weekdayInput = $('<input>')
          .attr({
            'name': "recurrence-input-weekday",
            'data-value': code,
            'type': 'checkbox'
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
      recurrenceControls.append(this._buildIntervalCtrls(interval, 'month(s)'));
      recurrenceControls.append($('<label>').text('Repeat on month days:'));
      recurrenceControls.append(this._buildMonthDayCtrls(monthDay));
      recurrenceControls.append(this._buildRecurrenceCtrls(freq, count, until));
    },
    
    _buildYearlyCtrls: function (recurrenceControls, freq, interval, count, until, monthDay, month) {
      recurrenceControls.append(this._buildIntervalCtrls(interval, 'year(s)'));
      recurrenceControls.append($('<label>').text('Repeat on every:'));
      
      var monthSelect = $('<select>') 
        .addClass('recurrence-input-month')  
        .attr('name', 'recurrenceMonth');
      for (var i = 1, l = 12; i < l; i++) {
        monthSelect.append(
          $('<option>')
            .attr("value", i)
            .text($.datepicker.regional[''].monthNames[i - 1])
        );
      }
      
      if (month !== undefined) {
        monthSelect.val(month);
      }
      
      recurrenceControls.append(monthSelect);
      recurrenceControls.append(this._buildMonthDayCtrls(monthDay));
      recurrenceControls.append(this._buildRecurrenceCtrls(freq, count, until));
    },
    
    _buildRecurrenceCtrls: function (freq, count, until) {
      var recurrence = $('<div>').addClass('recurrence-input-recurrence');
      recurrence.append($('<label>').text('End:'));
      
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
      
      $('<div>')
        .addClass('recurrenceInput-event-recurrence-select')
        .append(neverRadio)
        .append($('<span>').text('Never'))
        .appendTo(recurrence);
      
      $('<div>')
        .addClass('recurrenceInput-event-recurrence-select')
        .append(countRadio)
        .append($('<span>').text('After:'))
        .append(countInput)
        .append($('<span>').text('occurrence(s)'))
        .appendTo(recurrence);
      
      $('<div>')
        .addClass('recurrenceInput-event-recurrence-select')
        .append(untilRadio)
        .append($('<span>').text('On:'))
        .append(untilInput)
        .appendTo(recurrence);
      
      return recurrence;
    },
    
    _buildMonthDayCtrls: function (monthDay) {
      var monthDay = $('<div>')
        .addClass('recurrence-input-monthday');
      
      var monthDayInput = $('<input>')
        .attr({
          "name": "recurrenceMonthDay",
          "type": "number",
          "min": "1",
          "max": "31"
        });
      
      if (!isNaN(parseInt(monthDay))) {
        monthDayInput.val(monthDay);
      }
      
      monthDay.append(monthDayInput);
      monthDay.append('<span>(1 - 31)</span>');
      
      return monthDay;
    },
    
    _refreshText: function () {
      this.element.find('span[name="humanReadableRecurrence"]').text(this.humanReadable());
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
      
      if (json.monthDay !== undefined) {
        opts.bymonthday = json.monthDay;
      }

      if (json.month !== undefined) {
        opts.bymonth = json.month;
      }
      
      return new RRule(opts);
    },
    
    _rruleToJSON: function (rrule) {
      // TODO: dtStart?
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
      
      if (rrule.options.bymonthday !== undefined) {
        json.monthDay = rrule.options.bymonthday;
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
      this.element.find('input[name="recurrence-input-weekday"]').each(function(){
        if($(this).is(':checked')){
          weekdays.push($(this).data('value'));
        }
      });
      
      if(weekdays.length > 0){
        recurrence.weekdays = weekdays;
      }
      
      if(this.element.find('input[name="recurrenceMonthDay"]').length > 0){
        var monthDay = parseInt(this.element.find('input[name="recurrenceMonthDay"]').val());
        if (!isNaN(monthDay)) {
          recurrence.monthDay = parseInt(monthDay);
        }
      }
      
      if(this.element.find('select[name="recurrenceMonth"]').length > 0){
        var month = this.element.find('select[name="recurrenceMonth"]').val();
        if (!isNaN(month)) {
          recurrence.month = parseInt(month);
        }
      }
      
      return recurrence;
    },
    
    _onSaveButtonClick: function(e) {
      e.preventDefault();
      this.applyValues();
      this.hide();
    },
    
    _onCancelButtonClick: function (event) {
      event.preventDefault();
      this.hide();
    },
    
    _onRecurrenceFreqChange: function (event) {
      this._updateRecurrenceCtrl(this._readValues());
    },

    _onRecurrenceFreqKeyUp: function (event) {
      this._updateRecurrenceCtrl(this._readValues());
    },
    
    _onShowControlsLinkClick: function (event) {
      event.preventDefault();
      this.show();
    },
    
    _destroy: function () {
      this.element
        .empty()
        .removeClass('recurrence-input');
    }
  });

}).call(this);