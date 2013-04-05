package fi.muikku.plugins.calendar.rest;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.transaction.SystemException;
import javax.transaction.UserTransaction;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import fi.muikku.model.base.Environment;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.calendar.CalendarController;
import fi.muikku.plugins.calendar.model.Calendar;
import fi.muikku.plugins.calendar.model.Event;
import fi.muikku.plugins.calendar.model.LocalCalendar;
import fi.muikku.plugins.calendar.model.LocalEvent;
import fi.muikku.plugins.calendar.model.LocalEventType;
import fi.muikku.session.SessionController;
import fi.tranquil.TranquilModelEntity;
import fi.tranquil.Tranquility;
import fi.tranquil.TranquilityBuilder;
import fi.tranquil.TranquilityBuilderFactory;

@RequestScoped
@Path("/calendar")
@Stateful
@Produces ("application/json")
public class CalendarRESTService extends PluginRESTService {

	@Inject
	private SessionController sessionController;

	@Inject
	private CalendarController calendarController;
	
	@Resource
	private UserTransaction userTransaction;
	
	@SuppressWarnings("cdi-ambiguous-dependency")
	@Inject
	private TranquilityBuilderFactory tranquilityBuilderFactory;

  @GET
  @Path ("/calendars")
  public Response listCalendars() {
  	// TODO: Permissions
		// List all calendars user has permissions

  	Environment environment = sessionController.getEnvironment();
  	UserEntity user = sessionController.getUser();
  	
  	List<Calendar> calendars = calendarController.listCalendars(environment, user);

  	TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility();
  	
    return Response.ok(
    		tranquility.entities(calendars)
    ).build();
  }
  
  @GET
  @Path ("/calendars/{CALENDARID}")
  public Response getCalendar(@PathParam ("CALENDARID") Long calendarId) {
  	// TODO: Permissions
  	Calendar calendar = calendarController.findCalendar(calendarId);
  	if (calendar == null) {
  		return Response.status(Status.NOT_FOUND).build();
  	}

  	TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility();
    TranquilModelEntity entity = tranquility.entity(calendar);
  	
    return Response.ok(
    	entity
    ).build();
  }

  @POST
  @Path ("/calendars/{CALENDARID}/events")
  public Response createCalendarEvent(
  		@PathParam ("CALENDARID") Long calendarId, 
  		@FormParam ("typeId") Long typeId, 
  		@FormParam ("summary") String summary, 
  		@FormParam ("description") String description, 
  		@FormParam ("location") String location, 
  		@FormParam ("url") String url, 
  		@FormParam ("start") Long start, 
  		@FormParam ("end") Long end,
  		@FormParam ("allDay") Boolean allDay, 
  		@FormParam ("latitude") BigDecimal latitude, 
  		@FormParam ("longitude") BigDecimal longitude) {
  
  	// TODO: Permissions
  	Calendar calendar = calendarController.findCalendar(calendarId);
  	if (calendar == null) {
  		return Response.status(Status.NOT_FOUND).build();
  	}
  	
  	if (calendar instanceof LocalCalendar) {
  		LocalCalendar localCalendar = (LocalCalendar) calendar;

  		LocalEventType eventType = calendarController.findLocalEventType(typeId);
  		if (eventType == null) {
    		return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Could not find event type #" + typeId).build();
    	}
  		
    	LocalEvent localEvent = calendarController.createLocalEvent(localCalendar, eventType, summary, description, location, url, new Date(start), new Date(end), allDay, latitude, longitude);
    	
    	TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
      Tranquility tranquility = tranquilityBuilder.createTranquility();
    	
      return Response.ok(
      	tranquility.entity(localEvent)
      ).build();
  	} else {
  		return Response.status(Status.BAD_REQUEST).entity("Cannot add event into subscribed calendar").build();
  	}
  }
  
  @GET
  @Path ("/calendars/{CALENDARID}/events")
  public Response getCalendarEvents(@PathParam ("CALENDARID") Long calendarId, @QueryParam ("timeMin") Long timeMin, @QueryParam ("timeMax") Long timeMax) {
  	// TODO: Permissions
  	Calendar calendar = calendarController.findCalendar(calendarId);
  	if (calendar == null) {
  		return Response.status(Status.NOT_FOUND).build();
  	}
  	
  	List<Event> events = calendarController.listCalendarEvents(calendar, timeMin != null ? new Date(timeMin) : null, timeMax != null ? new Date(timeMax) : null);

  	TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility();
  	
    return Response.ok(
    	tranquility.entities(events)
    ).build();
  }
  
  @PUT
  @Path ("/calendars/{CALENDARID}/events/{EVENTID}")
  public Response updateCalendarEvent(
  		@PathParam ("CALENDARID") Long calendarId, 
  		@PathParam ("EVENTID") Long eventId, 
  		@FormParam ("typeId") Long typeId, 
  		@FormParam ("summary") String summary, 
  		@FormParam ("description") String description, 
  		@FormParam ("location") String location, 
  		@FormParam ("url") String url, 
  		@FormParam ("start") Long start, 
  		@FormParam ("end") Long end,
  		@FormParam ("allDay") Boolean allDay, 
  		@FormParam ("latitude") BigDecimal latitude, 
  		@FormParam ("longitude") BigDecimal longitude) {
  	
  	// TODO: Permissions
  	
  	LocalEvent localEvent = calendarController.findLocalEventById(eventId);
  	if (localEvent == null) {
  		return Response.status(Status.NOT_FOUND).build();
  	}
  	
  	if (!localEvent.getCalendar().getId().equals(calendarId)) {
  		return Response.status(Status.NOT_FOUND).build();
  	}

		LocalEventType eventType = calendarController.findLocalEventType(typeId);
		if (eventType == null) {
  		return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Could not find event type #" + typeId).build();
  	}
		
  	calendarController.updateLocalEvent(localEvent, eventType, summary, description, location, url, new Date(start), new Date(end), allDay, latitude, longitude);
  	
  	TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility();

  	return Response.ok(
      tranquility.entity(localEvent)
    ).build();
  }

  @POST
  @Path ("/localEventTypes") 
  public Response createLocalEventType(@FormParam ("name") String name) throws SystemException {
  	LocalEventType eventType = calendarController.createLocalEventType(name);
  	
  	TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility();
  	
    return Response.ok(
    	tranquility.entity(eventType)
    ).build();
  }

  @GET
  @Path ("/localEventTypes") 
  public Response listLocalEventTypes() {
  	List<LocalEventType> eventTypes = calendarController.listLocalEventTypes();
  	
  	TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility();
  	
    return Response.ok(
    	tranquility.entities(eventTypes)
    ).build();
  }
  
  
}
