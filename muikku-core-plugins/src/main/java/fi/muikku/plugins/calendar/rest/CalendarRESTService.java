package fi.muikku.plugins.calendar.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.calendar.CalendarServiceException;
import fi.muikku.calendar.DefaultCalendar;
import fi.muikku.calendar.DefaultCalendarEvent;
import fi.muikku.calendar.DefaultCalendarEventAttendee;
import fi.muikku.calendar.DefaultCalendarEventLocation;
import fi.muikku.calendar.DefaultCalendarEventReminder;
import fi.muikku.calendar.DefaultCalendarEventTemporalField;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.calendar.CalendarController;
import fi.muikku.plugins.calendar.model.UserCalendar;
import fi.muikku.plugins.calendar.rest.model.Calendar;
import fi.muikku.plugins.calendar.rest.model.CalendarEvent;
import fi.muikku.plugins.calendar.rest.model.CalendarEventAttendee;
import fi.muikku.plugins.calendar.rest.model.CalendarEventReminder;
import fi.muikku.security.LoggedIn;
import fi.muikku.session.SessionController;

@RequestScoped
@Path ("/calendar")
@Produces ("application/json")
public class CalendarRESTService extends PluginRESTService {

	@Inject
	private CalendarController calendarController;

  @Inject
	private SessionController sessionController;
	
	@POST
  @Path ("/calendars/")
  @LoggedIn
	public Response createCalendar(Calendar calendar) {
	  return Response.status(501).build();
	}
	
  @GET
  @Path ("/calendars/")
  @LoggedIn
  public Response listCalendars(@QueryParam ("writableOnly") Boolean writableOnly) {
    List<Calendar> result = new ArrayList<>();
    
    try {
      List<UserCalendar> userCalendars = calendarController.listUserCalendars(sessionController.getUser());
      for (UserCalendar userCalendar : userCalendars) {
        fi.muikku.calendar.Calendar calendar = calendarController.loadCalendar(userCalendar);
        if (calendar.isWritable() || !Boolean.TRUE.equals(writableOnly)) {
          result.add(new Calendar(
            userCalendar.getId(), 
            calendar.isWritable(),
            userCalendar.getVisible(),
            calendar.getSummary(), 
            calendar.getDescription())
          );          
        }
      }      
    } catch (CalendarServiceException e) {
      e.printStackTrace();
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
    
    return Response.ok(result).build();
  }
  
  @PUT
  @Path ("/calendars/{CALID}")
  @LoggedIn
  public Response updateCalendar(@PathParam ("CALID") Long calendarId, Calendar calendar) {
    if (calendar == null || calendarId == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    if (calendar.getId() == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    if (!calendar.getId().equals(calendarId)) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Calendar id is immutable").build();
    }
    
    if (StringUtils.isBlank(calendar.getSummary())) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Calendar summary is required").build();
    }
    
    UserCalendar userCalendar = calendarController.findUserCalendar(calendarId);
    if (userCalendar == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    if (!userCalendar.getUserId().equals(sessionController.getUser().getId())) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }
    
    try {
      calendarController.updateCalendar(userCalendar, new DefaultCalendar(userCalendar.getCalendarId(), calendar.isWritable(), userCalendar.getCalendarProvider(), calendar.getSummary(), calendar.getDescription()));
    } catch (CalendarServiceException e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
    
    return Response.noContent().build();
  }
  
  @DELETE
  @Path ("/calendars/{CALID}")
  @LoggedIn
  public Response deleteCalendar(@PathParam ("CALID") Long calendarId) {
    if (calendarId == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    UserCalendar userCalendar = calendarController.findUserCalendar(calendarId);
    if (userCalendar == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    if (!userCalendar.getUserId().equals(sessionController.getUser().getId())) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }
    
    try {
      calendarController.deleteCalendar(userCalendar);
    } catch (CalendarServiceException e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
    
    return Response.noContent().build();
  }
  
  @POST
  @Path ("/calendars/{CALID}/events/")
  @LoggedIn
  public Response createEvent(@PathParam ("CALID") Long calendarId, CalendarEvent event) {
    if (event == null || calendarId == null || event.getCalendarId() == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    if (!calendarId.equals(event.getCalendarId())) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Event calendar id does not match path calendar id").build();
    }
    
    if (StringUtils.isBlank(event.getSummary())) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Event summarys is required").build();
    }
    
    UserCalendar userCalendar = calendarController.findUserCalendar(calendarId);
    if (userCalendar == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    if (!userCalendar.getUserId().equals(sessionController.getUser().getId())) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }
    
    try {
      List<fi.muikku.calendar.CalendarEventAttendee> attendees = createEventAttendeeListFromRestModel(event.getAttendees());
      List<fi.muikku.calendar.CalendarEventReminder> reminders = createEventReminderListFromRestModel(event.getReminders());
      // TODO: Recurrence
      fi.muikku.calendar.CalendarEventRecurrence recurrence = null;

      fi.muikku.calendar.CalendarEvent calendarEvent = calendarController.createCalendarEvent(userCalendar, event.getSummary(), event.getDescription(), event.getStatus(), 
          event.getStart(), event.getStartTimeZone(), event.getEnd(), event.getEndTimeZone(), attendees, reminders, recurrence, 
          event.getExtendedProperties());
      
      return Response.ok(createEventRestModel(userCalendar, calendarEvent)).build();
    } catch (CalendarServiceException e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  
  
  @GET
  @Path ("/calendars/{CALID}/events/")
  @LoggedIn
  public Response getEvents(@PathParam ("CALID") Long calendarId, @QueryParam ("timeMin") Date timeMin, @QueryParam ("timeMax") Date timeMax) {
    if (calendarId == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    UserCalendar userCalendar = calendarController.findUserCalendar(calendarId);
    if (userCalendar == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    if (!userCalendar.getUserId().equals(sessionController.getUser().getId())) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }
    
    try {
      List<CalendarEvent> result = new ArrayList<>();
      
      List<fi.muikku.calendar.CalendarEvent> calendarEvents = calendarController.listCalendarEvents(userCalendar, timeMin, timeMax);
      for (fi.muikku.calendar.CalendarEvent calendarEvent : calendarEvents) { 
        result.add(createEventRestModel(userCalendar, calendarEvent));
      }

      return Response.ok(result).build();
    } catch (CalendarServiceException e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  @GET
  @Path ("/calendars/{CALID}/events/{EVTID}")
  @LoggedIn
  public Response getEvent(@PathParam ("CALID") Long calendarId, @PathParam ("EVTID") String eventId) {
    if (calendarId == null || StringUtils.isBlank(eventId)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    UserCalendar userCalendar = calendarController.findUserCalendar(calendarId);
    if (userCalendar == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    if (!userCalendar.getUserId().equals(sessionController.getUser().getId())) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }
    
    try {
      fi.muikku.calendar.CalendarEvent calendarEvent = calendarController.findCalendarEvent(userCalendar, eventId);
      if (calendarEvent == null) {
        return Response.status(Response.Status.NOT_FOUND).build();
      }
      
      return Response.ok(createEventRestModel(userCalendar, calendarEvent)).build();
    } catch (CalendarServiceException e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  @PUT
  @Path ("/calendars/{CALID}/events/{EVTID}")
  @LoggedIn
  public Response updateEvent(@PathParam ("CALID") Long calendarId, @PathParam ("EVTID") String eventId, CalendarEvent event) {
    if (calendarId == null || StringUtils.isBlank(eventId)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    if (event == null) {
      return Response.status(Response.Status.BAD_REQUEST).build();
    }

    if (StringUtils.isBlank(event.getSummary())) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Summary is mandatory").build();
    }

    UserCalendar userCalendar = calendarController.findUserCalendar(calendarId);
    if (userCalendar == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    if (!userCalendar.getUserId().equals(sessionController.getUser().getId())) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }
    
    try {
      fi.muikku.calendar.CalendarEvent originalCalendarEvent = calendarController.findCalendarEvent(userCalendar, eventId);
      if (originalCalendarEvent == null) {
        return Response.status(Response.Status.NOT_FOUND).build();
      }

      List<fi.muikku.calendar.CalendarEventAttendee> attendees = createEventAttendeeListFromRestModel(event.getAttendees());
      List<fi.muikku.calendar.CalendarEventReminder> reminders = createEventReminderListFromRestModel(event.getReminders());
      // TODO: Recurrence
      fi.muikku.calendar.CalendarEventRecurrence recurrence = null;

      fi.muikku.calendar.CalendarEventTemporalField start = new DefaultCalendarEventTemporalField(event.getStart(), event.getStartTimeZone());
      fi.muikku.calendar.CalendarEventTemporalField end = new DefaultCalendarEventTemporalField(event.getEnd(), event.getEndTimeZone());
      
      fi.muikku.calendar.CalendarEventLocation calendarEventLocation = new DefaultCalendarEventLocation(event.getLocation(), event.getVideoCallLink(), event.getLongitude(), event.getLongitude());
      
      fi.muikku.calendar.CalendarEvent calendarEvent = new DefaultCalendarEvent(originalCalendarEvent.getId(), originalCalendarEvent.getCalendarId(), originalCalendarEvent.getServiceProvider(), 
          event.getSummary(), event.getDescription(), event.getUrl(), calendarEventLocation, event.getStatus(), attendees, originalCalendarEvent.getOrganizer(), 
          start, end, event.isAllDay(), null, null, event.getExtendedProperties(), reminders, recurrence);
      
      calendarController.updateCalendarEvent(userCalendar, calendarEvent);
      
      return Response.noContent().build();
    } catch (CalendarServiceException e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  @DELETE
  @Path ("/calendars/{CALID}/events/{EVTID}")
  @LoggedIn
  public Response deleteEvent(@PathParam ("CALID") Long calendarId, @PathParam ("EVTID") String eventId) {
    if (calendarId == null || StringUtils.isBlank(eventId)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    UserCalendar userCalendar = calendarController.findUserCalendar(calendarId);
    if (userCalendar == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }
    
    if (!userCalendar.getUserId().equals(sessionController.getUser().getId())) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }
    
    try {
      calendarController.deleteCalendarEvent(userCalendar, eventId);
      return Response.noContent().build();
    } catch (CalendarServiceException e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }
  
  private CalendarEvent createEventRestModel(UserCalendar userCalendar, fi.muikku.calendar.CalendarEvent calendarEvent) {
    List<CalendarEventAttendee> attendees = new ArrayList<>();
    List<CalendarEventReminder> reminders = new ArrayList<>();
     
    if (calendarEvent.getAttendees() != null) {
      for (fi.muikku.calendar.CalendarEventAttendee calendarEventAttendee : calendarEvent.getAttendees()) {
        attendees.add(new CalendarEventAttendee(calendarEventAttendee.getEmail(), calendarEventAttendee.getDisplayName(), 
            calendarEventAttendee.getStatus(), calendarEventAttendee.getComment()));
      }
    }
    
    if (calendarEvent.getEventReminders() != null) {
      for (fi.muikku.calendar.CalendarEventReminder calendarEventReminder : calendarEvent.getEventReminders()) {
        reminders.add(new CalendarEventReminder(calendarEventReminder.getType(), calendarEventReminder.getMinutesBefore()));
      }
    }
    
    // TODO: Recurrence

    String location = calendarEvent.getLocation() != null ? calendarEvent.getLocation().getLocation() : null;
    String videoCallLink = calendarEvent.getLocation() != null ? calendarEvent.getLocation().getVideoCallLink() : null;
    BigDecimal longitude = calendarEvent.getLocation() != null ? calendarEvent.getLocation().getLongitude()  : null;
    BigDecimal latitude = calendarEvent.getLocation() != null ? calendarEvent.getLocation().getLatitude() : null;
    
    return new CalendarEvent(userCalendar.getId(), calendarEvent.getSummary(), calendarEvent.getDescription(), 
        calendarEvent.getUrl(), location, videoCallLink, longitude, latitude, calendarEvent.getStatus(),
        calendarEvent.getStart().getDateTime(), calendarEvent.getStart().getTimeZone(), 
        calendarEvent.getEnd().getDateTime(), calendarEvent.getEnd().getTimeZone(), calendarEvent.isAllDay(),
        calendarEvent.getCreated(), calendarEvent.getUpdated(), calendarEvent.getExtendedProperties(), attendees, reminders);
  }
  
  private List<fi.muikku.calendar.CalendarEventAttendee> createEventAttendeeListFromRestModel(List<CalendarEventAttendee> attendees) {
    List<fi.muikku.calendar.CalendarEventAttendee> result = new ArrayList<>();
    
    for (CalendarEventAttendee attendee : attendees) {
      result.add(new DefaultCalendarEventAttendee(attendee.getComment(), attendee.getEmail(), attendee.getDisplayName(), attendee.getStatus())); 
    }
    
    return result;
  }
  
  private List<fi.muikku.calendar.CalendarEventReminder> createEventReminderListFromRestModel(List<CalendarEventReminder> reminders) {
    List<fi.muikku.calendar.CalendarEventReminder> result = new ArrayList<>();
    
    for (CalendarEventReminder reminder : reminders) {
      result.add(new DefaultCalendarEventReminder(reminder.getMinutesBefore(), reminder.getType()));
    }
    
    return result;
  }

//  @GET
//  @Path ("/settings")
//  public Response listSettings() {
//  	UserEntity user = sessionController.getUser();
//
//  	Map<String, Object> settings = new HashMap<>();
//
//  	String firstDay = pluginSettingsController.getPluginUserSetting("calendar", CalendarPluginDescriptor.DEFAULT_FIRSTDAY_SETTING, user);
//  	if (StringUtils.isBlank(firstDay)) {
//  		firstDay = pluginSettingsController.getPluginSetting("calendar", CalendarPluginDescriptor.DEFAULT_FIRSTDAY_SETTING);
//  	}
//
//  	settings.put("firstDay", firstDay);
//
//    return Response.ok(
//      settings
//    ).build();
//  }
//
//  @PUT
//  @Path ("/settings")
//  public Response updateSetting(String data) {
//  	UserEntity user = sessionController.getUser();
//
//  	JSONObject jsonData = JSONObject.fromObject(data);
//  	@SuppressWarnings("unchecked") Set<String> keys = jsonData.keySet();
//
//		for (String key : keys) {
//			switch (key) {
//				case "firstDay":
//					pluginSettingsController.setPluginUserSetting("calendar", CalendarPluginDescriptor.DEFAULT_FIRSTDAY_SETTING, jsonData.getString(key), user);
//			  break;
//				default:
//					// TODO: Proper error handling
//					throw new RuntimeException("Calendar setting " + key + " can not be updated");
//			}
//		}
//
//    return Response.ok(data).build();
//  }
//
//	private BigDecimal getBigDecimal(JSONObject jsonData, String key) {
//		Object object = jsonData.get(key);
//		if (object == null) {
//			return null;
//		}
//
//		String value = null;
//
//		if (object instanceof JSONObject) {
//			JSONObject jsonObject = (JSONObject) object;
//
//  		if (jsonObject.isNullObject()) {
//  			return null;
//  		}
//
//  		value = jsonObject.toString();
//		} else if (object instanceof String) {
//			value = (String) object;
//		}
//
//		return NumberUtils.createBigDecimal(value);
//	}
//
//  public static class CalendarVisiblityValueGetter implements ValueGetter<Boolean> {
//
//  	public CalendarVisiblityValueGetter(List<UserCalendar> userCalendars) {
//			for (UserCalendar userCalendar : userCalendars) {
//				visibilities.put(userCalendar.getCalendar().getId(), userCalendar.getVisible());
//			}
//		}
//
//  	@Override
//  	public Boolean getValue(TranquilizingContext context) {
//  		Calendar calendar = (Calendar) context.getEntityValue();
//  		return visibilities.get(calendar.getId());
//  	}
//
//  	private Map<Long, Boolean> visibilities = new HashMap<>();
//  }
}
