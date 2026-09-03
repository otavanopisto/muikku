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
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
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
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
import fi.otavanopisto.muikku.workspaces.WorkspaceEntityName;
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
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Path("/event")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response createEvent(MuikkuEventRestModel restEvent, @QueryParam("users") List<Long> users) {

    if (restEvent == null || restEvent.getEventContainerId() == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }

    MuikkuEventContainer payloadContainer =
        eventController.findEventContainerById(restEvent.getEventContainerId());

    if (payloadContainer == null) {
      return Response.status(Status.NOT_FOUND)
        .entity("Event container not found")
        .build();
    }

    // Cannot create events in a container that they cannot even see
    if (!eventController.canViewEventContainer(payloadContainer, null)) {
      return Response.status(Status.FORBIDDEN).build();
    }

    List<MuikkuEvent> events =
        eventController.createEvents(restEvent, users, payloadContainer);
    
    List<MuikkuEventRestModel> restEvents = new ArrayList<>();

    for (MuikkuEvent event : events) {
      restEvents.add(toRestModel(event, null));
    }
    
    return Response.ok(restEvents)
      .build();
  }
  
  @Path("/event/{EVENTID}")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateEvent(@PathParam("EVENTID") Long eventId, MuikkuEventRestModel restEvent) {

    Long loggedUserEntityId = sessionController.getLoggedUserEntity().getId();
    
    // Payload validation
    
    MuikkuEvent event = eventController.findEventById(eventId);
    
    if (event == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event %d not found", restEvent.getId())).build();
    }
    
    // Access checks
    WorkspaceEntity workspaceEntity = null;
    if (event.getEventContainer().getWorkspaceEntityId() != null) {
      workspaceEntity = workspaceEntityController.findWorkspaceEntityById(event.getEventContainer().getWorkspaceEntityId());
    }
    
    boolean hasAccess = eventController.canEditEvent(workspaceEntity, event);
    
    if (!hasAccess) {
      return Response.status(Status.FORBIDDEN).entity((String.format("User %d attempt to edit event %d revoked", loggedUserEntityId, event.getId()))).build();
    }
    
    // Event update
    event = eventController.updateEvent(
        event, 
        restEvent.getStart(), 
        restEvent.getEnd(), 
        restEvent.isAllDay(), 
        restEvent.getTitle(), 
        restEvent.getDescription(), 
        restEvent.getType(), 
        restEvent.isEditable(), 
        restEvent.isPrivate(), 
        restEvent.isRemovable());
    
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
  public Response createEventProperty(@PathParam("EVENTID") Long eventId, @QueryParam("name") String name, @QueryParam("value") String value) {
    MuikkuEvent event = eventController.findEventById(eventId);
    if (event == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event %d not found", eventId)).build();
    }
    
    if (name == null || value == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // Access checks
    
    boolean hasAccess = eventController.canViewEvent(sessionController.getLoggedUserEntity(), event);
    
    if (!hasAccess) {
      return Response.status(Status.FORBIDDEN).entity((String.format("User %d attempt to edit event property %d revoked", sessionController.getLoggedUserEntity().getId(), event.getId()))).build();
    }
    
    MuikkuEventProperty property = eventController.createEventProperty(event, name, value, sessionController.getLoggedUserEntity().getId(), new Date());
    
    return Response.ok(toRestModel(property)).build();
  }
  
  @Path("/event/{EVENTID}/properties/{PROPERTYID}")
  @PUT
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response updateEventProperty(@PathParam("EVENTID") Long eventId, @PathParam("PROPERTYID") Long propertyId, @QueryParam("value") String value) {
    MuikkuEvent event = eventController.findEventById(eventId);
    if (event == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event %d not found", eventId)).build();
    }
    
    MuikkuEventProperty property = eventController.findEventProperty(propertyId);
    
    if (property == null) {
      return Response.status(Status.NOT_FOUND).entity(String.format("Event property %d not found", propertyId)).build();
    }
    
    if (value == null) {
      return Response.status(Status.BAD_REQUEST).build();
    }
    
    // User can update properties only if created by themselves
    if (eventController.canEditEventProperty(property)) {
      property = eventController.updateEventProperty(property, value, new Date());
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
  
  @Path("/events")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listEvents(
      @QueryParam("user") Long userEntityId,
      @QueryParam("workspace") Long workspaceEntityId,
      @QueryParam("start") String start,
      @QueryParam("end") String end,
      @QueryParam("adjustTimes") @DefaultValue("true") boolean adjustTimes,
      @QueryParam("type") EventType type) {
    
    // Request validation
    
    OffsetDateTime startDate = null;
    OffsetDateTime endDate = null;
    // Start and end dates cannot be empty
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
    
    // Both cannot be null at the same time
    // Note: This may no longer be applicable once events are expanded beyond absences
    if (userEntityId == null && workspaceEntityId == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing workspaceEntityId or userEntityId parameter").build();
    }
    
    // Access checks
    UserEntity loggedUserEntity = sessionController.getLoggedUserEntity();
    if (userEntityId != null) {
      if (!userEntityId.equals(sessionController.getLoggedUserEntity().getId())) {
        if (userEntityController.isStudent(loggedUserEntity)) {
          UserEntity target = userEntityController.findUserEntityById(userEntityId);
          if (userEntityController.isStudent(target)) {
            logger.warning(String.format("User %d attempt to list event of user %d revoked", sessionController.getLoggedUserEntity().getId(), userEntityId));
            return Response.status(Status.FORBIDDEN).build();
          }
        }
      }
    } else { // Students can only view their own events
      if (!userEntityController.isStaffMember(loggedUserEntity)) {
        return Response.status(Status.FORBIDDEN).build();
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
        if (sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)) {
          // At least the student must be a member of the workspace
          if (!workspaceUserEntityController.isWorkspaceMember(sessionController.getLoggedUser(), workspaceEntity)){
            return Response.status(Status.FORBIDDEN).build();
          }
        }
      }
    }
    
    // List events and convert to rest
    
    List<MuikkuEvent> events = eventController.listEvents(userEntityId, workspaceEntityId, startDate, endDate, type != null ? type : null);
    List<MuikkuEventRestModel> restEvents = new ArrayList<>();
    for (MuikkuEvent event : events) {
      // Access to specific event
      boolean hasAccess = eventController.canViewEvent(sessionController.getLoggedUserEntity(), event);
      if (!hasAccess) { 
        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierBySchoolDataIdentifier(sessionController.getLoggedUser());
        
        // If this is a staff member's event and the logged-in user is a student or a studentParent, the event may be returned as blocked, with only the start and end times included
        if (!userSchoolDataIdentifier.hasAnyRole(EnvironmentRoleArchetype.ADMINISTRATOR, EnvironmentRoleArchetype.MANAGER, EnvironmentRoleArchetype.STUDY_GUIDER, EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER, EnvironmentRoleArchetype.TEACHER)){
          MuikkuEventRestModel blockEvent = new MuikkuEventRestModel();
          
          blockEvent.setStart(toOffsetDateTime(event.getStart()));
          blockEvent.setEnd(toOffsetDateTime(event.getEnd()));
          
          restEvents.add(blockEvent);
        }
      } else {
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
  @RESTPermit(handling = Handling.INLINE)
  public Response getWorkspaceEventContainerId(@PathParam("WORKSPACEENTITYID") Long workspaceEntityId) {
    
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
    
    if (workspaceEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Workspace %d not found", workspaceEntityId)).build();
    }
    
    MuikkuEventContainer container = eventController.findEventContainerByUserOrWorkspace(null, workspaceEntityId);
    
    // If the container is not found, create one
    if (container == null) {
      WorkspaceEntityName workspaceEntityName = workspaceEntityController.getName(workspaceEntity);
      container = eventController.createEventContainer(workspaceEntityId, null, workspaceEntityName != null ? workspaceEntityName.getName() : null);
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
    restEvent.setType(event.getType());
    restEvent.setUserEntityId(event.getUserEntityId());
    
    if (event.getUserEntityId() != null) {
      UserEntity userEntity = userEntityController.findUserEntityById(event.getUserEntityId());
      restEvent.setTargetUserName(userEntityController.getName(userEntity, true).getDisplayName());
    }
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
    
    // flags to edit or delete event
    
    restEvent.setEditable(event.isEditableByUser());
    restEvent.setRemovable(event.isRemovableByUser());

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
    restProperty.setCreated(property.getCreated());
    restProperty.setUpdated(property.getUpdated());
    restProperty.setEventId(property.getEvent().getId());
    
    return restProperty;
  }
  
  private OffsetDateTime toOffsetDateTime(Date date) {
    return OffsetDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
  }
  
}
