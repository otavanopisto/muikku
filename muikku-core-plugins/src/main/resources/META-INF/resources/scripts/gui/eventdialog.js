(function() {
  RemoveEventDialog = $.klass({
    init : function(event) {
      this._event = event;
    },
    show : function() {
      this._openDialog();
      return this;
    },
    remove : function(deleteFunction) {
      this._deleteFunction = deleteFunction;
      return this;
    },
    _openDialog : function() {
      // TODO: Proper error handling
      var _this = this;
      renderDustTemplate('/calendar/removeevent.dust', {
        event : this._event
      }, function(text) {
        var buttons = {};
        
        buttons[getLocaleText('plugin.calendar.removeEventDialog.yesButton')] = function() {
          if (_this._deleteFunction) {
            _this._deleteFunction(_this._event);
          }

          $(this).dialog("close");
        };
        
        buttons[getLocaleText('plugin.calendar.removeEventDialog.noButton')] = function() {
          $(this).dialog("close");
        };

        var dialog = $(text).attr('title', getLocaleText('plugin.calendar.removeEventDialog.title')).dialog({
          modal : true,
          width : 500,
          buttons : buttons
        });
      });
    }
  });
  
  //TODO: Support for location discovery
  
  window.EventDialog = $.klass({
    init: function (event) {
      this._event = event||{};
    },
    show: function () {
      mApi().calendar.calendars.read({writableOnly: true}).callback($.proxy(function (err, result) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          this._openDialog(result);
        }
      }, this));
      
      return this;
    },
    save: function (saveFunction) {
      this._saveFunction = saveFunction;
      return this;
    },
    _openDialog: function (calendars) {
  
      // TODO: Proper error handling
      var _this = this;
      renderDustTemplate('/calendar/eventdialog.dust', {
        calendars: calendars
      }, function (text) {
        var buttons = {};
        if (_this._event.id) {
          buttons[getLocaleText('plugin.calendar.eventDialog.delete')] = function() {
            (new RemoveEventDialog(_this._event))
              .remove(function (event) {
                // TODO: Proper error handling
                RESTful.doDelete(CONTEXTPATH + '/rest/calendar/calendars/' + _this._event.calendarId + '/events/' + event.id)
                  .success(function (data, textStatus, jqXHR) {
                    $(document).trigger($.Event("calendarEventDialog:eventRemoved", {
                      id: event.id,
                      calendarId: event.calendarId
                    }));  
                    
                    $(dialog).dialog("close"); 
                  });
              })
              .show()
          };
        } 
        
        buttons[getLocaleText('plugin.calendar.eventDialog.save')] = function() {
          var startDate = $(this).find('input[name="fromDate"]').datepicker("getDate");
          var endDate = $(this).find('input[name="toDate"]').datepicker("getDate");
          if ((startDate == null) || (endDate == null)) {
            throw new Error("Date is required");
          } 
          
          var allDay = false;
          
          if (!$(this).find('input[name="allDay"]').is(":checked")) {
            var startTime = $(this).find('input[name="fromTime"]').timepicker("getTime");
            var endTime = $(this).find('input[name="toTime"]').timepicker("getTime");
            
            if ((startTime == null) || (endTime == null)) {
              throw new Error("Time is required");
            } 
            
            startDate.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
            endDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
            allDay = false;
          } else {
            startDate = new Date(startDate.getTime() + 1000 * 60 * 60 * 24);
            endDate = new Date(endDate.getTime() + (1000 * 60 * 60 * 24));
            allDay = true;
          }
          
          if ($(this).find('form').valid()) {
            if (_this._saveFunction) {
              var dataEvent = {
                id: _this._event.id,
                calendarId: $(this).find('select[name="calendarId"]').val(),
                typeId: $(this).find('select[name="typeId"]').val(),
                summary: $(this).find('input[name="summary"]').val(),
                location: $(this).find('input[name="location"]').val(),
                url: $(this).find('input[name="url"]').val(),
                latitude: $(this).find('input[name="latitude"]').val()||null,
                longitude: $(this).find('input[name="longitude"]').val()||null,
                start: startDate,
                end: endDate,
                description: $(this).find('textarea[name="description"]').val(),
                allDay: allDay
              };
    
              _this._saveFunction(_this._event, dataEvent);
              
              $(this).dialog("close");
            }
          } else {
            $(this).find('.error').first().focus();
          }
        };

        buttons[getLocaleText('plugin.calendar.eventDialog.cancel')] = function() {
          $(this).dialog("close"); 
        };

        var dialog = $(text)
        .attr('title', _this._event.id ? getLocaleText('plugin.calendar.eventDialog.editTitle') : getLocaleText('plugin.calendar.eventDialog.newTitle'));

        dialog.dialog({
          modal: true,
          width: 500,
          buttons: buttons
        });
  
        dialog.find('input[name="fromDate"]').datepicker();
        dialog.find('input[name="toDate"]').datepicker();
        dialog.find('input[name="fromTime"]').timepicker();
        dialog.find('input[name="toTime"]').timepicker();
        dialog.find('form').validate();
        
        dialog.find('input[name="allDay"]').change(function (events) {
          if ($(this).is(":checked")) {
            dialog.find('input[name="fromTime"]').hide();
            dialog.find('input[name="toTime"]').hide();
          } else {
            dialog.find('input[name="fromTime"]').show();
            dialog.find('input[name="toTime"]').show();
          }
        });
        
        dialog.find('select[name="calendarId"]').val(_this._event.calendarId);
        dialog.find('select[name="typeId"]').val(_this._event.typeId);
        dialog.find('input[name="summary"]').val(_this._event.summary);
        dialog.find('input[name="location"]').val(_this._event.location);
        dialog.find('input[name="url"]').val(_this._event.url);
        if (_this._event.allDay) {
          dialog.find('input[name="allDay"]').attr("checked", "checked");
          dialog.find('input[name="fromTime"]').hide();
          dialog.find('input[name="toTime"]').hide();
        }
        dialog.find('input[name="latitude"]').val(_this._event.latitude);
        dialog.find('input[name="longitude"]').val(_this._event.longitude);
        dialog.find('textarea[name="description"]').val(_this._event.description);
        
        if (_this._event.start) {
          dialog.find('input[name="fromDate"]').datepicker("setDate", _this._event.start);
          dialog.find('input[name="fromTime"]').timepicker("setTime", _this._event.start);
        }
        
        if (_this._event.end) {
          dialog.find('input[name="toDate"]').datepicker("setDate", _this._event.end);
          dialog.find('input[name="toTime"]').timepicker("setTime", _this._event.end);
        }
      });
    }
  });
  
}).call(this);