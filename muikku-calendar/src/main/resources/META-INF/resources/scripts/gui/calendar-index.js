(function() {
  $(document).ready(function(){
    $('#fpDayEvents').fullCalendar({
      defaultView : 'basicDay',
      timeFormat : 'HH', 
      firstDay : 1,
      header: false,
      lang : _MUIKKU_LOCALE,
      viewRender: function(view, element) {
        element.find('.fc-day-header').html('');
       }
    
    });
    
    $('#fpWeekView').fullCalendar({
      defaultView : 'agendaWeek',
      header: false,
      firstDay : 1,
      columnFormat : {
        week : 'ddd',
      },

      firstDay: 1,
      allDaySlot: false,
      defaultView : 'agendaWeek',
      firstHour: 8,
      header: false,
      columnFormat : {
        week : 'ddd'
      },
      dayClick: function(date, turha1, turha2) {
        var clickedTime = date.format('YYYY-MM-DD[T]HH:mm:ss.SSS');
//        var clickedToIso = clickedTime.toISOString();
        var clickedDate = clickedTime.substring(5, 7) + "/"
                        + clickedTime.substring(8, 10) + "/"
                        + clickedTime.substring(0, 4);
                
        var clickedMinutes = clickedTime.substring(14, 16);
        var clickedHour = String(parseInt(clickedTime.substring(11, 13)));
        var clickedClock = clickedHour + ":" + clickedMinutes;
        
        var n = parseInt(clickedHour) + 1;
        var nextHour = n > 9 ? "" + n: "0" + n;
        var clockAfterHour = nextHour + ":" + clickedMinutes;
        
        $("<div />", {
          html: clickedClock + "<br />Ei tapahtumaa"
        }).dialog({
          modal: true,
          buttons: [{
            text: "Luo tapahtuma",
            click: function() {
              $("<div />", {
                html: "Tapahtuman nimi<input type='text' id='eventName' /><br />"
                    + "Kalenteri <select id='calendarList' /><br />"
                    + "Alkaa <input id='startDate' value='"
                    + clickedDate + "' />"
                    + "<input id='startTime' value='" + clickedClock
                    + "' /><br />"
                    + "Loppuu <input id='endDate' value='"
                    + clickedDate + "' />"
                    + "<input id='endTime' value='"
                    + clockAfterHour + "' />"
              }).dialog({
                modal: true,
                title: "Uusi tapahtuma",
                buttons: [{
                  text: "Tallenna",
                  click: function() {
                    var startDateISO = $("#startDate").val().substring(6) + "-"
                                     + $("#startDate").val().substring(0, 2) + "-"
                                     + $("#startDate").val().substring(3, 5);
                    var endDateISO = $("#endDate").val().substring(6) + "-"
                                   + $("#endDate").val().substring(0, 2) + "-"
                                   + $("#endDate").val().substring(3, 5);
                    
                    var newEventStart = startDateISO + "T" + $("#startTime").val() + ":00.000Z";
                    var newEventEnd = endDateISO + "T" + $("#endTime").val() + ":00.000Z";
                    
                    mApi({async: false}).calendar.calendars.events.create($("#calendarList").val(), {
                      summary: $('#eventName').val(),
                      description: null,
                      recurrence: null,
                      status: 'CONFIRMED',
                      start: newEventStart,
                      startTimeZone: 'GMT',
                      end: newEventEnd,
                      endTimeZone: 'GMT',
                      allDay: false
                    });
                    window.location.reload(true);
                  }
                },{
                  text: "Peruuta",
                  click: function() {
                    $(this).dialog("destroy").remove();
                  }
                }]
              });
              
              $("#startDate").datepicker();
              $("#endDate").datepicker();
              $("#startTime").timepicker().timepicker({"timeFormat": "H:i",
                                                       "useSelect": true});
              $("#endTime").timepicker().timepicker({"timeFormat": "H:i",
                                                     "useSelect": true});
              
              mApi({async: false}).calendar.calendars.read().callback($.proxy(function (err, calendars) {
            if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            $('#eventCalendar option').remove();
              for (var i = 0, l = calendars.length; i < l; i++) {
                var calendar = calendars[i];
                $('#calendarList').append($('<option>').attr('value', calendar.id).text(calendar.summary));
              }
          }
              }));
            }
          },{
            text: "Sulje",
            click: function() {
              $(this).dialog("destroy").remove();
            }
          }]
        });
      },
      eventClick: function(event, turha1, turha2) {
        var idTable = event.id.split(":");
        var Id = idTable[1];
        var kalenteri = idTable[0];
        
        $("<div/>", {
          html: event.title
        }).dialog({
          modal: true,
          title: "Tapahtuman tiedot",
          buttons: [{
            text: "Muokkaa",
            click: function() {
              var startHours = event.start.toISOString().substring(11, 13);
              var endHours = event.end.toISOString().substring(11, 13);
                
              $("<div />", {
                html: "<b>Tapahtuma</b><input type='text' id='newTitle' value='"
                    + event.title + "'/>"
            
                    + "<b>Alkaa </b><input id='newStartTime' type='text' value='"
                    + String(parseInt(startHours) + 3)
                    + event.start.toISOString().substring(13, 16) + "'/>"
            
                    + "<b> Loppuu </b><input id='newEndTime' type='text' value='"
                    + String(parseInt(endHours) + 3)
                    + event.end.toISOString().substring(13, 16) + "'/>"
              }).dialog({
                modal: true,
                title: "Tapahtuman muokkaus",
                buttons: [{
                  text: "Muokkaa",
                  click: function() {
                    $("<div />", {
                      html: "Haluatko varmasti tallentaa muutokset?"
                    }).dialog({
                      title: "Tapahtuman päivittäminen",
                      buttons: [{
                        text: "Kyllä",
                        click: function() {
                            
                          var oldStart = event.start.toISOString();
                          var oldEnd = event.start.toISOString();
                          
                          var newStart = "" + oldStart.substring(0, 10) + "T"
                                            + $("#newStartTime").val() + ":00.000Z";
                          var newEnd = "" + oldEnd.substring(0, 10) + "T"
                                            + $("#newEndTime").val() + ":00.000Z";
                          
                          mApi({async: false}).calendar.calendars.events.update(kalenteri, Id, {
                            summary: $("#newTitle").val(),
                            description: null,
                            recurrence: null,
                            status: 'CONFIRMED',
                            start: newStart,
                            startTimeZone: 'GMT',
                            end: newEnd,
                            endTimeZone: 'GMT',
                            allDay: false
                          });
                          
                          window.location.reload(true);
                        }
                      },{
                        text: "Ei",
                        click: function() {
                          $(this).dialog("close");
                        }
                      }]
                    });
                  }
                },{
                  text: "Peruuta",
                  click: function() {
                    $(this).dialog("destroy").remove();
                  }
                }]
              });
              
              $("#newStartTime").timepicker().timepicker({"timeFormat": "H:i",
                                                          "useSelect": true});
              $("#newEndTime").timepicker().timepicker({"timeFormat": "H:i",
                                                        "useSelect": true});
            }
          },{
            text: "Poista",
            click: function() {
              $("<div/>", {
                html: "Haluatko varmasti poistaa tämän tapahtuman?"
              }).dialog({
                title: "Tapahtuman poisto",
                buttons: [{
                  text: "Kyllä",
                  click: function() {
                    mApi({async: false}).calendar.calendars.events.del(kalenteri, Id);
                    $("#fpWeekView").fullCalendar("removeEvents", kalenteri + ":" + Id);
                    window.location.reload(true);
                  }
                },{
                  text: "Ei",
                  click: function() {
                    $(this).dialog("close");
                  }
                }]
              });
            }
          }]
        });

      },      
      height : 500,
      lang : _MUIKKU_LOCALE,
    });
  
    loadFullCalendarEvents($('#fpDayEvents'));
    loadFullCalendarEvents($('#fpWeekView'));
  });
  
})(this);