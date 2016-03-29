package fi.otavanopisto.muikku.plugins.calendar.rest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
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

import fi.otavanopisto.muikku.calendar.CalendarServiceException;
import fi.otavanopisto.muikku.calendar.DefaultCalendar;
import fi.otavanopisto.muikku.calendar.DefaultCalendarEvent;
import fi.otavanopisto.muikku.calendar.DefaultCalendarEventAttendee;
import fi.otavanopisto.muikku.calendar.DefaultCalendarEventLocation;
import fi.otavanopisto.muikku.calendar.DefaultCalendarEventReminder;
import fi.otavanopisto.muikku.calendar.DefaultCalendarEventTemporalField;
import fi.otavanopisto.muikku.plugin.PluginRESTService;
import fi.otavanopisto.muikku.plugins.calendar.CalendarController;
import fi.otavanopisto.muikku.plugins.calendar.model.UserCalendar;
import fi.otavanopisto.muikku.plugins.calendar.rest.model.Calendar;
import fi.otavanopisto.muikku.plugins.calendar.rest.model.CalendarEvent;
import fi.otavanopisto.muikku.plugins.calendar.rest.model.CalendarEventAttendee;
import fi.otavanopisto.muikku.plugins.calendar.rest.model.CalendarEventReminder;
import fi.otavanopisto.muikku.rest.RESTPermitUnimplemented;
import fi.otavanopisto.muikku.rest.types.DateTimeParameter;
import fi.otavanopisto.muikku.session.SessionController;

@Stateful
@RequestScoped
@Path ("/calendar")
@Produces ("application/json")
public class CalendarRESTService extends PluginRESTService {

  private static final long serialVersionUID = 5698069370957155106L;
  
  @Inject
  private Logger logger;

  @Inject
  private CalendarController calendarController;

  @Inject
  private SessionController sessionController;

  @POST
  @Path ("/calendars/")
  @RESTPermitUnimplemented
  public Response createCalendar(Calendar calendar) {
    return Response.status(501).build();
  }

  @GET
  @Path ("/calendars/")
  @RESTPermitUnimplemented
  public Response listCalendars(@QueryParam ("writableOnly") Boolean writableOnly) {
    List<Calendar> result = new ArrayList<>();
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }

    try {
      List<UserCalendar> userCalendars = calendarController.listUserCalendars(sessionController.getLoggedUserEntity());
      for (UserCalendar userCalendar : userCalendars) {
        fi.otavanopisto.muikku.calendar.Calendar calendar = calendarController.loadCalendar(userCalendar);
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
      logger.log(Level.SEVERE, "Failed to retrieve calendars", e);
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }

    return Response.ok(result).build();
  }

  @PUT
  @Path ("/calendars/{CALID}")
  @RESTPermitUnimplemented
  public Response updateCalendar(@PathParam ("CALID") Long calendarId, Calendar calendar) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }

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

    if (!userCalendar.getUserId().equals(sessionController.getLoggedUserEntity().getId())) {
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
  @RESTPermitUnimplemented
  public Response deleteCalendar(@PathParam ("CALID") Long calendarId) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }

    if (calendarId == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    UserCalendar userCalendar = calendarController.findUserCalendar(calendarId);
    if (userCalendar == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    if (!userCalendar.getUserId().equals(sessionController.getLoggedUserEntity().getId())) {
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
  @Path ("/calendars/{CALID:[0-9]*}/events/")
  @RESTPermitUnimplemented
  public Response createEvent(@PathParam ("CALID") Long calendarId, CalendarEvent event) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }

    if (event == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Event payload is missing").build();
    }

    if (calendarId == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    if (StringUtils.isBlank(event.getSummary())) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Event summarys is required").build();
    }

    if (event.getStatus() == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Event status is required").build();
    }

    UserCalendar userCalendar = calendarController.findUserCalendar(calendarId);
    if (userCalendar == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    if (!userCalendar.getUserId().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }

    try {
      List<fi.otavanopisto.muikku.calendar.CalendarEventAttendee> attendees = createEventAttendeeListFromRestModel(event.getAttendees());
      List<fi.otavanopisto.muikku.calendar.CalendarEventReminder> reminders = createEventReminderListFromRestModel(event.getReminders());

      fi.otavanopisto.muikku.calendar.CalendarEvent calendarEvent = calendarController.createCalendarEvent(userCalendar, event.getSummary(), event.getDescription(), event.getStatus(),
          event.getStart(), event.getStartTimeZone(), event.getEnd(), event.getEndTimeZone(), attendees, reminders, event.getRecurrence(), event.isAllDay(),
          event.getExtendedProperties());

      return Response.ok(createEventRestModel(userCalendar, calendarEvent)).build();
    } catch (CalendarServiceException e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }

  @GET
  @Path ("/calendars/{CALID}/events/")
  @RESTPermitUnimplemented
  public Response getEvents(@PathParam ("CALID") Long calendarId, @QueryParam ("timeMin") DateTimeParameter timeMin, @QueryParam ("timeMax") DateTimeParameter timeMax) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }

    if (calendarId == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    UserCalendar userCalendar = calendarController.findUserCalendar(calendarId);
    if (userCalendar == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    if (!userCalendar.getUserId().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }

    try {
      List<CalendarEvent> result = new ArrayList<>();

      List<fi.otavanopisto.muikku.calendar.CalendarEvent> calendarEvents = calendarController.listCalendarEvents(userCalendar, timeMin != null ? timeMin.getDateTime() : null, timeMax != null ? timeMax.getDateTime() : null);
      for (fi.otavanopisto.muikku.calendar.CalendarEvent calendarEvent : calendarEvents) {
        result.add(createEventRestModel(userCalendar, calendarEvent));
      }

      return Response.ok(result).build();
    } catch (CalendarServiceException e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }

  @GET
  @Path ("/calendars/{CALID}/events/{EVTID}")
  @RESTPermitUnimplemented
  public Response getEvent(@PathParam ("CALID") Long calendarId, @PathParam ("EVTID") String eventId) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }

    if (calendarId == null || StringUtils.isBlank(eventId)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    UserCalendar userCalendar = calendarController.findUserCalendar(calendarId);
    if (userCalendar == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    if (!userCalendar.getUserId().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }

    try {
      fi.otavanopisto.muikku.calendar.CalendarEvent calendarEvent = calendarController.findCalendarEvent(userCalendar, eventId);
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
  @RESTPermitUnimplemented
  public Response updateEvent(@PathParam ("CALID") Long calendarId, @PathParam ("EVTID") String eventId, CalendarEvent event) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }

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

    if (!userCalendar.getUserId().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }

    try {
      fi.otavanopisto.muikku.calendar.CalendarEvent originalCalendarEvent = calendarController.findCalendarEvent(userCalendar, eventId);
      if (originalCalendarEvent == null) {
        return Response.status(Response.Status.NOT_FOUND).build();
      }

      List<fi.otavanopisto.muikku.calendar.CalendarEventAttendee> attendees = createEventAttendeeListFromRestModel(event.getAttendees());
      List<fi.otavanopisto.muikku.calendar.CalendarEventReminder> reminders = createEventReminderListFromRestModel(event.getReminders());
      
      fi.otavanopisto.muikku.calendar.CalendarEventTemporalField start = new DefaultCalendarEventTemporalField(event.getStart(), event.getStartTimeZone());
      fi.otavanopisto.muikku.calendar.CalendarEventTemporalField end = new DefaultCalendarEventTemporalField(event.getEnd(), event.getEndTimeZone());

      fi.otavanopisto.muikku.calendar.CalendarEventLocation calendarEventLocation = new DefaultCalendarEventLocation(event.getLocation(), event.getVideoCallLink(), event.getLongitude(), event.getLongitude());

      fi.otavanopisto.muikku.calendar.CalendarEvent calendarEvent = new DefaultCalendarEvent(originalCalendarEvent.getId(), originalCalendarEvent.getCalendarId(), originalCalendarEvent.getServiceProvider(),
          event.getSummary(), event.getDescription(), event.getUrl(), calendarEventLocation, event.getStatus(), attendees, originalCalendarEvent.getOrganizer(),
          start, end, event.isAllDay(), null, null, event.getExtendedProperties(), reminders, event.getRecurrence());

      calendarController.updateCalendarEvent(userCalendar, calendarEvent);

      return Response.noContent().build();
    } catch (CalendarServiceException e) {
      e.printStackTrace();
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }

  @DELETE
  @Path ("/calendars/{CALID}/events/{EVTID}")
  @RESTPermitUnimplemented
  public Response deleteEvent(@PathParam ("CALID") Long calendarId, @PathParam ("EVTID") String eventId) {
    
    if (!sessionController.isLoggedIn()) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }

    if (calendarId == null || StringUtils.isBlank(eventId)) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    UserCalendar userCalendar = calendarController.findUserCalendar(calendarId);
    if (userCalendar == null) {
      return Response.status(Response.Status.NOT_FOUND).build();
    }

    if (!userCalendar.getUserId().equals(sessionController.getLoggedUserEntity().getId())) {
      return Response.status(Response.Status.FORBIDDEN).build();
    }

    try {
      calendarController.deleteCalendarEvent(userCalendar, eventId);
      return Response.noContent().build();
    } catch (CalendarServiceException e) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
    }
  }

  private CalendarEvent createEventRestModel(UserCalendar userCalendar, fi.otavanopisto.muikku.calendar.CalendarEvent calendarEvent) {
    List<CalendarEventAttendee> attendees = new ArrayList<>();
    List<CalendarEventReminder> reminders = new ArrayList<>();

    if (calendarEvent.getAttendees() != null) {
      for (fi.otavanopisto.muikku.calendar.CalendarEventAttendee calendarEventAttendee : calendarEvent.getAttendees()) {
        attendees.add(new CalendarEventAttendee(calendarEventAttendee.getEmail(), calendarEventAttendee.getDisplayName(),
            calendarEventAttendee.getStatus(), calendarEventAttendee.getComment()));
      }
    }

    if (calendarEvent.getEventReminders() != null) {
      for (fi.otavanopisto.muikku.calendar.CalendarEventReminder calendarEventReminder : calendarEvent.getEventReminders()) {
        reminders.add(new CalendarEventReminder(calendarEventReminder.getType(), calendarEventReminder.getMinutesBefore()));
      }
    }

    String recurrence = calendarEvent.getRecurrence();
    String location = calendarEvent.getLocation() != null ? calendarEvent.getLocation().getLocation() : null;
    String videoCallLink = calendarEvent.getLocation() != null ? calendarEvent.getLocation().getVideoCallLink() : null;
    BigDecimal longitude = calendarEvent.getLocation() != null ? calendarEvent.getLocation().getLongitude()  : null;
    BigDecimal latitude = calendarEvent.getLocation() != null ? calendarEvent.getLocation().getLatitude() : null;
    return new CalendarEvent(userCalendar.getId(), calendarEvent.getId(), calendarEvent.getSummary(), calendarEvent.getDescription(),
        calendarEvent.getUrl(), location, videoCallLink, longitude, latitude, calendarEvent.getStatus(),
        calendarEvent.getStart().getDateTime(), calendarEvent.getStart().getTimeZone(),
        calendarEvent.getEnd().getDateTime(), calendarEvent.getEnd().getTimeZone(), calendarEvent.isAllDay(),
        calendarEvent.getCreated(), calendarEvent.getUpdated(), calendarEvent.getExtendedProperties(), attendees, reminders, recurrence);
  }

  private List<fi.otavanopisto.muikku.calendar.CalendarEventAttendee> createEventAttendeeListFromRestModel(List<CalendarEventAttendee> attendees) {
    List<fi.otavanopisto.muikku.calendar.CalendarEventAttendee> result = new ArrayList<>();
    if (attendees != null) {
      for (CalendarEventAttendee attendee : attendees) {
        result.add(new DefaultCalendarEventAttendee(attendee.getComment(), attendee.getEmail(), attendee.getDisplayName(), attendee.getStatus()));
      }
    }

    return result;
  }

  private List<fi.otavanopisto.muikku.calendar.CalendarEventReminder> createEventReminderListFromRestModel(List<CalendarEventReminder> reminders) {
    List<fi.otavanopisto.muikku.calendar.CalendarEventReminder> result = new ArrayList<>();

    if (reminders != null) {
      for (CalendarEventReminder reminder : reminders) {
        result.add(new DefaultCalendarEventReminder(reminder.getMinutesBefore(), reminder.getType()));
      }
    }
    
    return result;
  }
}
