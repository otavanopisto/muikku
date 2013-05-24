// TODO: Support for location discovery
EventDialog = $.klass({
  init: function (event) {
    this._event = event||{};
  },
  show: function () {
    // TODO: Error handling
    
    RESTful.doGet(CONTEXTPATH + "/rest/calendar/calendars?calendarType=LOCAL").success($.proxy(function (calendars, textStatus, jqXHR) {
      RESTful.doGet(CONTEXTPATH + "/rest/calendar/localEventTypes").success($.proxy(function (localEventTypes, textStatus, jqXHR) {
        this._openDialog(calendars, localEventTypes);
      }, this));
    }, this));
    
    return this;
  },
  save: function (saveFunction) {
    this._saveFunction = saveFunction;
    return this;
  },
  _openDialog: function (calendars, localEventTypes) {

    // TODO: Localize
    // TODO: Proper error handling
    var _this = this;
    renderDustTemplate('/calendar/newevent.dust', {
      calendars: calendars,
      types: localEventTypes
    }, function (text) {
      var dialog = $(text)
        .attr('title', _this._event.id ? 'Edit Event' : "New Event")
        .dialog({
          modal: true,
          width: 500,
          buttons: {
            "Cancel": function() {
              $(this).dialog("close"); 
            },
            "Save": function() {
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
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                allDay = true;
              }
              
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
            }
          }
        });

      dialog.find('input[name="fromDate"]').datepicker();
      dialog.find('input[name="toDate"]').datepicker();
      dialog.find('input[name="fromTime"]').timepicker();
      dialog.find('input[name="toTime"]').timepicker();
      
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