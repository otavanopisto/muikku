package fi.otavanopisto.muikku.plugins.event.rest;

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

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.event.MuikkuEventController;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEvent;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventContainer;
import fi.otavanopisto.muikku.plugins.event.model.EventAttendance;
import fi.otavanopisto.muikku.plugins.event.model.EventType;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventParticipant;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventProperty;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/muikkuEvent")
@RequestScoped
@Stateful
@Produces(MediaType.APPLICATION_JSON)
public class MuikkuEventRESTService {
  
  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private MuikkuEventController eventController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Path("/event")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createEvent(MuikkuEventRestModel restEvent, @QueryParam("users") List<Long> users) {

    // Access checks
    boolean isStudent = userEntityController.isStudent(sessionController.getLoggedUserEntity());

    if (restEvent == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    // Container check
    if (restEvent.getEventContainerId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing event container").build();
    }
    
    MuikkuEventContainer payloadContainer = eventController.findEventContainerById(restEvent.getEventContainerId());
    
    if (payloadContainer == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event container %d not found", restEvent.getEventContainerId())).build();
    }
    
    boolean isWorkspaceContainer = payloadContainer.getWorkspaceEntityId() != null;
    boolean isUserContainer = payloadContainer.getUserEntityId() != null;
    
    WorkspaceEntity workspaceEntity = null;
    
    if (isWorkspaceContainer) {
      workspaceEntity = workspaceEntityController.findWorkspaceEntityById(payloadContainer.getWorkspaceEntityId());
    }
    
    MuikkuEvent event = null;
    List<MuikkuEventPropertyRestModel> restProperties = new ArrayList<MuikkuEventPropertyRestModel>();
    List<MuikkuEventRestModel> restEvents = new ArrayList<MuikkuEventRestModel>();
    
    // Students can't create events for other 
    // An event can only be created for a user group within the workspace’s event container
    if (!users.isEmpty() && !isStudent && isWorkspaceContainer) {
      for (Long userId : users) {
        UserEntity userEntity = userEntityController.findUserEntityById(userId);
        if (userEntity == null) {
          continue;
        }
        
        // The target user must be a member of the workspace
        boolean isWorkspaceMember = workspaceUserEntityController.isWorkspaceMember(userEntity.defaultSchoolDataIdentifier(), workspaceEntity);
        
        if (isWorkspaceMember) {
          event = eventController.createEvent(
              restEvent.getStart(), 
              restEvent.getEnd(), 
              restEvent.isAllDay(),
              restEvent.getTitle(), 
              restEvent.getDescription(), 
              EventType.valueOf(restEvent.getType()), 
              userId,
              restEvent.isEditable(), 
              restEvent.isPrivate(), 
              restEvent.isRemovable(), 
              payloadContainer);
          
          // EventProperties
          if (restEvent.getProperties() != null) {
            for (MuikkuEventPropertyRestModel restProperty : restEvent.getProperties()) {
              MuikkuEventProperty property = eventController.createEventProperty(event, restProperty.getName(), restProperty.getValue(), sessionController.getLoggedUserEntity().getId(), restProperty.getDate());
              
              restProperties.add(toRestModel(property));
            }
          }
          
          restEvents.add(toRestModel(event, restProperties));
        }
      }
    } else {
      
      if (restEvent.getUserEntityId() == null) {
        return Response.status(Status.BAD_REQUEST).entity("Missing user entity").build();
      }
      
      UserEntity userEntity = userEntityController.findUserEntityById(restEvent.getUserEntityId());
      
      if (userEntity == null) {
        return Response.status(Status.BAD_REQUEST).entity("Missing user entity").build();
      }
      
      // Students can create events only for themselves
      if (isStudent && sessionController.getLoggedUserEntity().getId() != restEvent.getUserEntityId() && userEntityController.isStudent(userEntity)) {
        return Response.status(Status.FORBIDDEN).build();
      }
      
      // If the event is user-specific, the container must be the target user’s container
      
      if (isUserContainer && !isWorkspaceContainer) {
        MuikkuEventContainer targetUserContainer = eventController.findEventContainerByUserOrWorkspace(userEntity.getId(), null);
        if (targetUserContainer != null) {
          if (payloadContainer.getUserEntityId() != targetUserContainer.getUserEntityId()) {
            return Response.status(Status.FORBIDDEN).build();
          }
        }
      }
      
      // Workspace specific event
      
      if (isWorkspaceContainer) {
        boolean isWorkspaceMember = workspaceUserEntityController.isWorkspaceMember(userEntity.defaultSchoolDataIdentifier(), workspaceEntity);
        
        if (!isWorkspaceMember) {
          return Response.status(Status.BAD_REQUEST).entity(String.format("User %d is not the member of workspace %d", userEntity.getId(), workspaceEntity.getId())).build();
        }
      }
      
      event = eventController.createEvent(
          restEvent.getStart(), 
          restEvent.getEnd(), 
          restEvent.isAllDay(),
          restEvent.getTitle(),
          restEvent.getDescription(), 
          EventType.valueOf(restEvent.getType()),
          restEvent.getUserEntityId(), 
          restEvent.isEditable(), 
          restEvent.isPrivate(), 
          restEvent.isRemovable(),
          payloadContainer);
      
      // EventProperties
      if (restEvent.getProperties() != null) {
        for (MuikkuEventPropertyRestModel restProperty : restEvent.getProperties()) {
          MuikkuEventProperty property = eventController.createEventProperty(event, restProperty.getName(), restProperty.getValue(), sessionController.getLoggedUserEntity().getId(), restProperty.getDate());
          
          restProperties.add(toRestModel(property));
        }
      }
      
      restEvents.add(toRestModel(event, restProperties));
    }

    return Response.ok(restEvents).build();

  }
  
  @Path("/event/{EVENTID}")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateEvent(@PathParam("EVENTID") Long eventId, MuikkuEventRestModel restEvent) {
    
    // Payload validation
    
    MuikkuEvent event = eventController.findEventById(eventId);
    
    if (event == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event %d not found", restEvent.getId())).build();
    }
    
    Long userEntityId = sessionController.getLoggedUserEntity().getId();
    if (!event.getUserEntityId().equals(userEntityId) && !restEvent.isEditable() || sessionController.getLoggedUserEntity().getId() == event.getCreatorEntityId()) {
      logger.warning(String.format("User %d attempt to edit calendar event %d revoked", userEntityId, event.getId()));
      return Response.status(Status.FORBIDDEN).build();
    }

    // Access checks
    

    // Event update
    
    if (event.isEditableByUser() && event.getUserEntityId() == sessionController.getLoggedUserEntity().getId() || sessionController.getLoggedUserEntity().getId() == event.getCreatorEntityId()) {
      event = eventController.updateEvent(
          event, 
          restEvent.getStart(), 
          restEvent.getEnd(), 
          restEvent.isAllDay(), 
          restEvent.getTitle(), 
          restEvent.getDescription(), 
          EventType.valueOf(restEvent.getType()), 
          restEvent.isEditable(), 
          restEvent.isPrivate(), 
          restEvent.isRemovable());
    }
    
    // Event properties
    List<MuikkuEventProperty> properties = eventController.listPropertiesByEvent(event);
    List<MuikkuEventPropertyRestModel> restProperties = new ArrayList<MuikkuEventPropertyRestModel>();
    if (properties != null) {
      for (MuikkuEventProperty property : properties) {
        restProperties.add(toRestModel(property));
      }
    }
    
    return Response.ok(toRestModel(event, restProperties)).build();
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
   * @return 204 (no content)
   */
  @Path("/event/{EVENTID}")
  @DELETE
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteEvent(@PathParam("EVENTID") Long eventId) {
    
    // Payload validation
    
    Long userEntityId = sessionController.getLoggedUserEntity().getId();
    MuikkuEvent event = eventController.findEventById(eventId);
    if (event == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event %d not found", eventId)).build();
    }
    
    // If our own event, delete it entirely. Otherwise, only delete our participation in it
    
    if (event.getCreatorEntityId().equals(userEntityId) || event.isRemovableByUser() && userEntityId == event.getUserEntityId()) {
      eventController.deleteEvent(event);
    }
    
    return Response.noContent().build();
  }
  
  @Path("/event/{EVENTID}/properties")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createEventProperty(@PathParam("EVENTID") Long eventId, MuikkuEventPropertyRestModel payload) {
    MuikkuEvent event = eventController.findEventById(eventId);
    if (event == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event %d not found", eventId)).build();
    }
    
    if (payload == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // TODO: Access checks here!!
    
    MuikkuEventProperty property = eventController.createEventProperty(event, payload.getName(), payload.getValue(), sessionController.getLoggedUserEntity().getId(), new Date());
    
    return Response.ok(toRestModel(property)).build();
  }
  
  @Path("/event/{EVENTID}/properties/{PROPERTYID}")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateEventProperty(@PathParam("EVENTID") Long eventId, @PathParam("PROPERTYID") Long propertyId, MuikkuEventPropertyRestModel payload) {
    MuikkuEvent event = eventController.findEventById(eventId);
    if (event == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event %d not found", eventId)).build();
    }
    
    MuikkuEventProperty property = eventController.findEventProperty(propertyId);
    
    if (property == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event property %d not found", propertyId)).build();
    }
    
    if (payload == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // TODO: Access checks here!!
    
    if (sessionController.getLoggedUserEntity().getId() == property.getUserEntityId()) { // User can update properties only if created by themselves
      property = eventController.updateEventProperty(property, payload.getName(), payload.getValue(), sessionController.getLoggedUserEntity().getId(), payload.getDate());
    }
    
    return Response.ok(toRestModel(property)).build();
  }
  
  @Path("/event/property/{EVENTPROPERTYID}")
  @DELETE
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response deleteEventProperty(@PathParam("EVENTPROPERTYID") Long eventPropertyId) {
    
    // Payload validation
    MuikkuEventProperty property = eventController.findEventPropertyById(eventPropertyId);
    
    if (property == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event property %d not found", eventPropertyId)).build();
    }
    
    // If our own event property, delete it entirely
    
    if (property.getUserEntityId() == sessionController.getLoggedUserEntity().getId()) {
      eventController.deleteEventProperty(property);
    }
    
    return Response.noContent().build();
  }
  
  @Path("/event/{EVENTID}/attendance/{ATTENDANCE}")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateAttendance(@PathParam("EVENTID") Long eventId, @PathParam("ATTENDANCE") EventAttendance attendance) {
    MuikkuEvent event = eventController.findEventById(eventId);
    if (event == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event %d not found", eventId)).build();
    }
    MuikkuEventParticipant participant = eventController.findParticipant(event, sessionController.getLoggedUserEntity().getId());
    if (participant == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Event %d participant not found", eventId)).build();
    }
    eventController.updateEventAttendance(participant, attendance);
    return Response.ok(toRestModel(event, null)).build();
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
   * @return Events of the given user
   */
  @Path("/events")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listEvents(
      @QueryParam("user") Long userEntityId,
      @QueryParam("workspace") Long workspaceEntityId,
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
    
    // Workspace
    if (workspaceEntityId != null) {
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceEntityId);
      
      if (workspaceEntity != null) {
        
      }
    }
    
    // List events and convert to rest
    
    List<MuikkuEvent> events = eventController.listByUserAndWorkspaceAndTimeframeAndType(userEntityId, workspaceEntityId, startDate, endDate, type != null ? EventType.valueOf(type) : null);
    List<MuikkuEventRestModel> restEvents = new ArrayList<>();
    for (MuikkuEvent event : events) {
      
      // Event properties
      List<MuikkuEventProperty> properties = eventController.listPropertiesByEvent(event);
      List<MuikkuEventPropertyRestModel> restProperties = new ArrayList<MuikkuEventPropertyRestModel>();
      if (properties != null) {
        for (MuikkuEventProperty property : properties) {
          restProperties.add(toRestModel(property));
        }
      }
      restEvents.add(toRestModel(event, restProperties));
    }
    
    return Response.ok(restEvents).build();
  }
  
  @Path("/user/{USERENTITYID}/container")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getUserEventContainerId(@PathParam("USERENTITYID") Long userEntityId) {
    
    // Students should see only their own event containers
    if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT) && userEntityId != sessionController.getLoggedUserEntity().getId()) {
      return Response.status(Status.FORBIDDEN).build();
    }
    
    UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
    
    if (userEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("User %d not found", userEntityId)).build();
    }
    
    MuikkuEventContainer container = eventController.findEventContainerByUserOrWorkspace(userEntityId, null);
    
    // If the container is not found, create one
    if (container == null) {
      User user = userController.findUserByUserEntityDefaults(userEntity);
      container = eventController.createEventContainer(null, userEntityId, user.getDisplayName());
    }
    
    return Response.ok(container != null ? container.getId() : null).build();
  }
  
  @Path("/workspace/{WORKSPACEENTITYID}/container")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getWorkspaceEventContainerId(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Workspace %d not found", workspaceEntityId)).build();
    }
    
    MuikkuEventContainer container = eventController.findEventContainerByUserOrWorkspace(null, workspaceEntityId);
    
    // If the container is not found, create one
    if (container == null) {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      container = eventController.createEventContainer(workspaceEntityId, null, workspace.getName());
    }
    
    return Response.ok(container != null ? container.getId() : null).build();
  }
  
  private MuikkuEventRestModel toRestModel(MuikkuEvent event, List<MuikkuEventPropertyRestModel> properties) {

    if (event == null) {
      return null;
    }

    MuikkuEventRestModel restEvent = new MuikkuEventRestModel();
    
    // Event basic information
    
    restEvent.setId(event.getId());
    restEvent.setEventId(event.getEventId());
    restEvent.setEventContainerId(event.getEventContainer().getId());
    restEvent.setStart(toOffsetDateTime(event.getStart()));
    restEvent.setEnd(toOffsetDateTime(event.getEnd()));
    restEvent.setAllDay(event.getAllDay());
    restEvent.setTitle(event.getTitle());
    restEvent.setDescription(event.getDescription());
    restEvent.setType(event.getType().name());
    restEvent.setUserEntityId(event.getUserEntityId());
    restEvent.setCreator(event.getCreatorEntityId());
    List<MuikkuEventParticipant> participants = eventController.listParticipants(event);
    
    // Privacy checks

    Long userEntityId = sessionController.getLoggedUserEntity().getId();
    boolean myEvent = event.getUserEntityId().equals(userEntityId);
    boolean publicEvent = !event.isPrivate();
    boolean isParticipant = myEvent ? true : eventController.isEventParticipant(event, userEntityId);
    
    // For students, even public events of others are considered private unless the student is a participant
    
    if (!isParticipant && userEntityController.isStudent(sessionController.getLoggedUserEntity())) {
      publicEvent = false;
    }
    
    // Only show event title and description if we are participating or the event is public
    
    if (!isParticipant && !publicEvent) {
      restEvent.setTitle(null);
      restEvent.setDescription(null);
    }
    
    // Event participants

    if (isParticipant || publicEvent) {
      for (MuikkuEventParticipant participant : participants) {
        MuikkuEventParticipantRestModel restParticipant = new MuikkuEventParticipantRestModel();
        restParticipant.setUserEntityId(participant.getUserEntityId());
        restParticipant.setAttendance(participant.getAttendance());
        UserEntity userEntity = userEntityController.findUserEntityById(participant.getUserEntityId());
        restParticipant.setName(userEntityController.getName(userEntity, true).getDisplayNameWithLine());
        restEvent.addParticipant(restParticipant);
      }
    }
    
    // UI convenience flags to edit or delete event
    
    restEvent.setEditable(myEvent);
    restEvent.setRemovable(isParticipant);

    // Event properties
    
    if (properties != null) {
      restEvent.setProperties(properties);
    }
    
    return restEvent;
  }
  
  private MuikkuEventPropertyRestModel toRestModel(MuikkuEventProperty property) {
    if (property == null) {
      return null;
    }
    
    MuikkuEventPropertyRestModel restProperty = new MuikkuEventPropertyRestModel();
    
    restProperty.setId(property.getId());
    restProperty.setName(property.getName());
    restProperty.setValue(property.getValue());
    restProperty.setUserEntityId(property.getUserEntityId());
    restProperty.setDate(property.getDate());
    restProperty.setEventId(property.getEvent().getId());
    
    return restProperty;
  }
  
  private OffsetDateTime toOffsetDateTime(Date date) {
    return OffsetDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
  }
  
}
