package fi.otavanopisto.muikku.plugins.calendar.rest;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.calendar.CalendarController;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEvent;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventAttendance;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventParticipant;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventVisibility;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/calendar")
@RequestScoped
@Stateful
@Produces(MediaType.APPLICATION_JSON)
public class CalendarRESTService {
  
  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private CalendarController calendarController;
  
  @Inject
  private UserEntityController userEntityController;
  
  /**
   * REQUEST:
   * 
   * mApi().calendar.event.create({
   *   'start': '2021-10-28T10:00:00+02:00',
   *   'end': '2021-10-28T12:00:00+02:00',
   *   'allDay': true | false,
   *   'title': 'Event title',
   *   'description': 'Event description',
   *   'visibility': 'PRIVATE | PUBLIC',
   *   'type': 'optional event type',
   *   'participants': [
   *     {
   *       'userEntityId': 123
   *     },
   *     {
   *       'userEntityId': 456
   *     }
   *   ]
   * });
   * 
   * RESPONSE:
   * 
   * {
   *   'id': 123456,
   *   'start': '2021-10-28T10:00:00+02:00',
   *   'end': '2021-10-28T12:00:00+02:00',
   *   'allDay': true | false,
   *   'title': 'Event title',
   *   'description': 'Event description',
   *   'visibility': 'PRIVATE | PUBLIC',
   *   'type': 'optional event type',
   *   'userEntityId': 100, // owner of event
   *   'participants': [
   *     {
   *       'userEntityId': 123,
   *       'name': 'John Doe',
   *       'attendance': 'UNCONFIRMED | YES | NO | MAYBE'
   *     },
   *     {
   *       'userEntityId': 456,
   *       'name': 'Jane Doe',
   *       'attendance': 'UNCONFIRMED | YES | NO | MAYBE'
   *     }
   *   ],
   *   'editable': true | false, // only event owner can edit
   *   'removable': true | false // owner and participants can delete
   * }
   * 
   * DESCRIPTION:
   * 
   * Creates a new calendar event
   * 
   * @param payload Payload object
   * 
   * @return Created calendar event
   */
  @Path("/event")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createEvent(CalendarEventRestModel restEvent) {
    
    // Access checks
    
    Long userEntityId = sessionController.getLoggedUserEntity().getId();
    boolean isStudent = userEntityController.isStudent(sessionController.getLoggedUserEntity());
    if (isStudent && restEvent.getParticipants() != null) {
      for (CalendarEventParticipantRestModel restParticipant : restEvent.getParticipants()) {
        UserEntity userEntity = userEntityController.findUserEntityById(restParticipant.getUserEntityId());
        if (userEntityController.isStudent(userEntity)) {
          logger.warning(String.format("Student %d attempt to create event to include student %d revoked", userEntityId, restParticipant.getUserEntityId()));
          return Response.status(Status.BAD_REQUEST).build();
        }
      }
    }
    
    // Event creation
    
    CalendarEvent event = calendarController.createEvent(
        restEvent.getStart(),
        restEvent.getEnd(),
        restEvent.isAllDay(),
        restEvent.getTitle(),
        restEvent.getDescription(), 
        restEvent.getVisibility(),
        restEvent.getType());
    
    // Participants
    
    List<CalendarEventParticipant> participants = new ArrayList<>();
    if (restEvent.getParticipants() != null) {
      for (CalendarEventParticipantRestModel restParticipant : restEvent.getParticipants()) {
        participants.add(new CalendarEventParticipant(restParticipant.getUserEntityId()));
      }
    }
    calendarController.setParticipants(event, participants);
    
    return Response.ok(toRestModel(event)).build();
  }
  
  /**
   * REQUEST:
   * 
   * mApi().calendar.event.update({
   *   'id': 123456,
   *   'start': '2021-10-28T10:00:00+02:00',
   *   'end': '2021-10-28T12:00:00+02:00',
   *   'allDay': true | false,
   *   'title': 'Event title',
   *   'description': 'Event description',
   *   'visibility': 'PRIVATE | PUBLIC',
   *   'type': 'optional event type',
   *   'participants': [
   *     {
   *       'userEntityId': 123
   *     },
   *     {
   *       'userEntityId': 456
   *     }
   *   ]
   * });
   * 
   * RESPONSE:
   * 
   * {
   *   'id': 123456,
   *   'start': '2021-10-28T10:00:00+02:00',
   *   'end': '2021-10-28T12:00:00+02:00',
   *   'allDay': true | false,
   *   'title': 'Event title',
   *   'description': 'Event description',
   *   'visibility': 'PRIVATE | PUBLIC',
   *   'type': 'optional event type',
   *   'userEntityId': 100, // owner of event
   *   'participants': [
   *     {
   *       'userEntityId': 123,
   *       'name': 'John Doe',
   *       'attendance': 'UNCONFIRMED | YES | NO | MAYBE'
   *     },
   *     {
   *       'userEntityId': 456,
   *       'name': 'Jane Doe',
   *       'attendance': 'UNCONFIRMED | YES | NO | MAYBE'
   *     }
   *   ],
   *   'editable': true | false, // only event owner can edit
   *   'removable': true | false // owner and participants can delete
   * }
   * 
   * DESCRIPTION:
   * 
   * Updates an existing calendar event
   * 
   * @param payload Payload object
   * 
   * @return Updated calendar event
   */
  @Path("/event")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateEvent(CalendarEventRestModel restEvent) {
    
    // Payload validation
    
    CalendarEvent event = calendarController.findEventById(restEvent.getId());
    if (event == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event %d not found", restEvent.getId())).build();
    }
    Long userEntityId = sessionController.getLoggedUserEntity().getId();
    if (!event.getUserEntityId().equals(userEntityId)) {
      logger.warning(String.format("User %d attempt to edit calendar event %d revoked", userEntityId, event.getId()));
      return Response.status(Status.FORBIDDEN).build();
    }

    // Access checks
    
    boolean isStudent = userEntityController.isStudent(sessionController.getLoggedUserEntity());
    if (isStudent && restEvent.getParticipants() != null) {
      for (CalendarEventParticipantRestModel restParticipant : restEvent.getParticipants()) {
        UserEntity userEntity = userEntityController.findUserEntityById(restParticipant.getUserEntityId());
        if (userEntityController.isStudent(userEntity)) {
          logger.warning(String.format("Student %d attempt to edit event to include student %d revoked", userEntityId, restParticipant.getUserEntityId()));
          return Response.status(Status.BAD_REQUEST).build();
        }
      }
    }

    // Event update
    
    event = calendarController.updateEvent(
        event,
        restEvent.getStart(),
        restEvent.getEnd(),
        restEvent.isAllDay(),
        restEvent.getTitle(),
        restEvent.getDescription(), 
        restEvent.getVisibility(),
        restEvent.getType());
    
    // Participants 
    
    List<CalendarEventParticipant> participants = new ArrayList<>();
    if (restEvent.getParticipants() != null) {
      for (CalendarEventParticipantRestModel restParticipant : restEvent.getParticipants()) {
        participants.add(new CalendarEventParticipant(restParticipant.getUserEntityId()));
      }
    }
    calendarController.setParticipants(event, participants);
    
    return Response.ok(toRestModel(event)).build();
  }

  /**
   * REQUEST:
   * 
   * mApi().calendar.event.del(123456); // event id
   * 
   * RESPONSE:
   * 
   * Null if deleting own event, modified event if deleting participation
   * 
   * DESCRIPTION:
   * 
   * Removes the given calendar event.
   * 
   * @param eventId Event id  
   * 
   * @return Null if deleting own event, modified event if deleting participation
   */
  @Path("/event/{EVENTID}")
  @DELETE
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteEvent(@PathParam("EVENTID") Long eventId) {
    
    // Payload validation
    
    Long userEntityId = sessionController.getLoggedUserEntity().getId();
    CalendarEvent event = calendarController.findEventById(eventId);
    if (event == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event %d not found", eventId)).build();
    }
    
    // If our own event, delete it entirely. Otherwise, only delete our participation in it
    
    if (event.getUserEntityId().equals(userEntityId)) {
      calendarController.deleteEvent(event);
      event = null;
    }
    else {
      CalendarEventParticipant participant = calendarController.findParticipant(event, userEntityId);
      if (participant == null) {
        logger.warning(String.format("User %d attempt to delete calendar event %d revoked", userEntityId, event.getId()));
      }
      else {
        calendarController.removeParticipant(participant);
      }
    }
    
    return Response.ok(toRestModel(event)).build();
  }
  
  /**
   * REQUEST:
   * 
   * mApi().calendar.event.attendance.update(123, 'UNCONFIRMED | YES | NO | MAYBE'); // 123 = event id
   * 
   * RESPONSE:
   * 
   * Updated calendar event
   * 
   * DESCRIPTION:
   * 
   * Updates the currently logged in user's attendance to the given event. The user has to be
   * a participant in the event.
   * 
   * @param eventId Event id
   * @param attendance Event attendance
   * 
   * @return Updated calendar event
   */
  @Path("/event/{EVENTID}/attendance/{ATTENDANCE}")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateAttendance(@PathParam("EVENTID") Long eventId, @PathParam("ATTENDANCE") CalendarEventAttendance attendance) {
    CalendarEvent event = calendarController.findEventById(eventId);
    if (event == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event %d not found", eventId)).build();
    }
    CalendarEventParticipant participant = calendarController.findParticipant(event, sessionController.getLoggedUserEntity().getId());
    if (participant == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Event %d participant not found", eventId)).build();
    }
    calendarController.updateEventAttendance(participant, attendance);
    return Response.ok(toRestModel(event)).build();
  }
  
  /**
   * REQUEST:
   * 
   * mApi().calendar.events.read({
   *   'user': 123,
   *   'start': '2021-10-28T00:00:00+02:00',
   *   'end': '2021-10-28T23:59:59+02:00',
   *   'adjustTimes': true | false, // defaults to true
   *   'type': 'optional event type'
   * });
   * 
   * RESPONSE:
   * 
   * Array of calendar events
   * 
   * DESCRIPTION:
   * 
   * Returns events for the given user, timeframe, and (optional) event type
   * 
   * @param userEntityId User
   * @param start Timeframe start
   * @param end Timeframe end
   * @param adjustTimes Should timeframe start and end times be start and end of day
   * @param type Event type (optional)
   * 
   * @return Orders of the given user
   */
  @Path("/events")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listEvents(
      @QueryParam("user") Long userEntityId,
      @QueryParam("start") String start,
      @QueryParam("end") String end,
      @QueryParam("adjustTimes") @DefaultValue("true") boolean adjustTimes,
      @QueryParam("type") String type) {
    
    // Request validation
    
    OffsetDateTime startDate = null;
    OffsetDateTime endDate = null;
    if (StringUtils.isEmpty(start) || StringUtils.isEmpty(end)) {
      return Response.status(Status.BAD_REQUEST).entity("Missing start/end parameters").build();
    }
    try {
      startDate = OffsetDateTime.parse(start);
      endDate = OffsetDateTime.parse(end);
    }
    catch (DateTimeParseException e) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid time format: %s", e.getMessage())).build();
    }
    
    // Access checks
    
    if (userEntityId == null) {
      userEntityId = sessionController.getLoggedUserEntity().getId();
    }
    if (!userEntityId.equals(sessionController.getLoggedUserEntity().getId())) {
      UserEntity caller = sessionController.getLoggedUserEntity();
      if (userEntityController.isStudent(caller)) {
        UserEntity target = userEntityController.findUserEntityById(userEntityId);
        if (userEntityController.isStudent(target)) {
          logger.warning(String.format("User %d attempt to list calendar of user %d revoked", sessionController.getLoggedUserEntity().getId(), userEntityId));
          return Response.status(Status.FORBIDDEN).build();
        }
      }
    }
    
    // Time adjustments
    
    if (adjustTimes) {
      startDate = startDate.withHour(0).withMinute(0).withSecond(0).withNano(0);
      endDate = endDate.withHour(23).withMinute(59).withSecond(59).withNano(999999000);
    }
    
    // List events and convert to rest
    
    List<CalendarEvent> events = calendarController.listEventsByUserAndTimeframeAndType(userEntityId, startDate, endDate, type);
    List<CalendarEventRestModel> restEvents = new ArrayList<>();
    for (CalendarEvent event : events) {
      restEvents.add(toRestModel(event));
    }
    
    return Response.ok(restEvents).build();
  }
  
  private CalendarEventRestModel toRestModel(CalendarEvent event) {

    if (event == null) {
      return null;
    }

    CalendarEventRestModel restEvent = new CalendarEventRestModel();
    
    // Event basic information
    
    restEvent.setId(event.getId());
    restEvent.setStart(toOffsetDateTime(event.getStart()));
    restEvent.setEnd(toOffsetDateTime(event.getEnd()));
    restEvent.setAllDay(event.getAllDay());
    restEvent.setTitle(event.getTitle());
    restEvent.setDescription(event.getDescription());
    restEvent.setVisibility(event.getVisibility());
    restEvent.setType(event.getType());
    restEvent.setUserEntityId(event.getUserEntityId());
    List<CalendarEventParticipant> participants = calendarController.listParticipants(event);
    
    // Privacy checks

    Long userEntityId = sessionController.getLoggedUserEntity().getId();
    boolean myEvent = event.getUserEntityId().equals(userEntityId);
    boolean publicEvent = event.getVisibility() == CalendarEventVisibility.PUBLIC;
    boolean isParticipant = myEvent ? true : calendarController.isEventParticipant(event, userEntityId);
    
    // For students, even public events are private unless the student is a participant
    
    if (!isParticipant && userEntityController.isStudent(sessionController.getLoggedUserEntity())) {
      publicEvent = false;
    }
    
    // Only show event title and description if the event is ours or public
    
    if (!myEvent && !publicEvent) {
      restEvent.setTitle(null);
      restEvent.setDescription(null);
    }
    
    // Event participants

    if (myEvent || publicEvent) {
      for (CalendarEventParticipant participant : participants) {
        CalendarEventParticipantRestModel restParticipant = new CalendarEventParticipantRestModel();
        restParticipant.setUserEntityId(participant.getUserEntityId());
        restParticipant.setAttendance(participant.getAttendance());
        UserEntity userEntity = userEntityController.findUserEntityById(participant.getUserEntityId());
        restParticipant.setName(userEntityController.getName(userEntity).getDisplayNameWithLine());
        restEvent.addParticipant(restParticipant);
      }
    }
    
    // UI convenience flags to edit or delete event
    
    restEvent.setEditable(myEvent);
    restEvent.setRemovable(isParticipant);

    return restEvent;
  }
  
  private OffsetDateTime toOffsetDateTime(Date date) {
    return OffsetDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
  }
  
}
