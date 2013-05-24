(function() {
  
  NewEventWidgetController = $.klass(WidgetController, {
    init: function () {
      this._super(arguments);
    },
    setup: function (widgetElement) {
      this._widgetElement = $(widgetElement);
      
      this._widgetElement.find(".newEventButton")
        .click($.proxy(this._onNewEventButtonClick, this));
    },
    _onNewEventButtonClick: function (event) {
      (new EventDialog())
        .save($.proxy(function (originalData, eventData) {
          RESTful.doPost(CONTEXTPATH + '/rest/calendar/calendars/' + eventData.calendarId + '/events', {
            data: {
              type_id: parseInt(eventData.typeId),
              summary: eventData.summary,
              description: eventData.description,
              location: eventData.location,
              url: eventData.url,
              start: eventData.start.getTime(),
              end: eventData.end.getTime(),
              allDay: eventData.allDay,
              latitude: eventData.latitude,
              longitude: eventData.longitude
            }
          })
          .success(function (data, textStatus, jqXHR) {
            $(document).trigger($.Event("newEventWidget:eventCreate", {
              event: data
            })); 
          });
        }, this))
        .show();
    }
  });
  
  addWidgetController('newEventWidget', NewEventWidgetController);
  
}).call(this);