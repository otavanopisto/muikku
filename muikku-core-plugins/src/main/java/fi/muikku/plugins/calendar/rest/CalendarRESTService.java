package fi.muikku.plugins.calendar.rest;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.transaction.SystemException;
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

import net.fortuna.ical4j.data.ParserException;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.model.base.Environment;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.calendar.CalendarController;
import fi.muikku.plugins.calendar.CalendarPluginDescriptor;
import fi.muikku.plugins.calendar.model.Calendar;
import fi.muikku.plugins.calendar.model.CalendarCategory;
import fi.muikku.plugins.calendar.model.Event;
import fi.muikku.plugins.calendar.model.LocalCalendar;
import fi.muikku.plugins.calendar.model.LocalEvent;
import fi.muikku.plugins.calendar.model.LocalEventType;
import fi.muikku.plugins.calendar.model.SubscribedCalendar;
import fi.muikku.plugins.calendar.model.UserCalendar;
import fi.muikku.session.SessionController;
import fi.tranquil.TranquilModelEntity;
import fi.tranquil.Tranquility;
import fi.tranquil.TranquilityBuilder;
import fi.tranquil.TranquilityBuilderFactory;
import fi.tranquil.TranquilizingContext;
import fi.tranquil.instructions.PropertyInjectInstruction.ValueGetter;
import fi.tranquil.instructions.SuperClassInstructionSelector;

@RequestScoped
@Path("/calendar")
@Stateful
@Produces ("application/json")
public class CalendarRESTService extends PluginRESTService {
	
	@Inject
	private Logger logger;

	@Inject
	private SessionController sessionController;

	@Inject
	private CalendarController calendarController;
	
	@Inject
	private PluginSettingsController pluginSettingsController;
	
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
  	
  	List<UserCalendar> userCalendars = calendarController.listUserCalendars(environment, user);
  	List<Calendar> calendars = new ArrayList<Calendar>(userCalendars.size());
  	for (UserCalendar userCalendar : userCalendars) {
  		calendars.add(userCalendar.getCalendar());
  	}

  	TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder
    		.createTranquility()
        .addInstruction(new SuperClassInstructionSelector(Calendar.class), tranquilityBuilder.createPropertyInjectInstruction("visible", new CalendarVisiblityValueGetter(userCalendars)));
  	
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
  	
  	UserEntity user = sessionController.getUser();
  	
  	UserCalendar userCalendar = calendarController.findUserCalendarByCalendarAndUser(calendar, user);
  	if (userCalendar == null) {
  		return Response.status(Status.NOT_FOUND).build();
  	}
  	
  	TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder
    		.createTranquility()
        .addInstruction(new SuperClassInstructionSelector(Calendar.class), tranquilityBuilder.createPropertyInjectInstruction("visible", new CalendarVisiblityValueGetter(Arrays.asList(userCalendar))));

    TranquilModelEntity entity = tranquility.entity(calendar);
  	
    return Response.ok(
    	entity
    ).build();
  }
  
  @PUT
  @Path ("/calendars/{CALENDARID}")
  public Response saveCalendar(@PathParam ("CALENDARID") Long calendarId, String data) {
  	// TODO: Permissions
  	Calendar calendar = calendarController.findCalendar(calendarId);
  	if (calendar == null) {
  		return Response.status(Status.NOT_FOUND).build();
  	}
  	
  	UserEntity user = sessionController.getUser();
  	
  	UserCalendar userCalendar = calendarController.findUserCalendarByCalendarAndUser(calendar, user);
  	if (userCalendar == null) {
  		return Response.status(Status.NOT_FOUND).build();
  	}
  	
  	ObjectMapper mapper = new ObjectMapper();  
  	try {
			Map<String, Object> jsonData = mapper.readValue(data, new TypeReference<Map<String, Object>>() { });
			for (String key : jsonData.keySet()) {
				switch (key) {
					case "visible":
						Boolean visible = (Boolean) jsonData.get("visible");
						if (visible != null) {
							calendarController.updateUserCalendarVisible(userCalendar, visible);
						}
				  break;
					case "name":
						String name = (String) jsonData.get("name");
						if (name != null) {
							calendarController.updateCalendarName(calendar, name);
						}
					break;
					case "calendarCategory_id":
						Long calendarCategoryId = (Long) jsonData.get("calendarCategory_id");
						if (calendarCategoryId != null) {
							CalendarCategory calendarCategory = calendarController.findCalendarCategoryById(calendarCategoryId);
							if (calendarCategory != null) {
								calendarController.updateCalendarCategory(calendar, calendarCategory);
							} else {
							  // TODO: Proper error handling
								throw new RuntimeException("Invalid calendarCategory_id");
							}
						}
					break;
					default:
						// TODO: Proper error handling
						throw new RuntimeException("Calendar property " + key + " can not be updated");
				}
			}
		} catch (IOException e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
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
  public Response createCalendarEvent(@PathParam ("CALENDARID") Long calendarId, String data) {
  
  	// TODO: Permissions
  	Calendar calendar = calendarController.findCalendar(calendarId);
  	if (calendar == null) {
  		return Response.status(Status.NOT_FOUND).build();
  	}
  	
  	if (calendar instanceof LocalCalendar) {
  		LocalCalendar localCalendar = (LocalCalendar) calendar;

  		ObjectMapper mapper = new ObjectMapper();  
  		Map<String, Object> jsonData;
			try {
				jsonData = mapper.readValue(data, new TypeReference<Map<String, Object>>() { });
			} catch (IOException e) {
				return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
			}

  		String summary = (String) jsonData.get("summary");
  		String description = (String) jsonData.get("description");
  		String location = (String) jsonData.get("location");
  		String url = (String) jsonData.get("url");
  		Date start = new Date((Long) jsonData.get("start"));
  		Date end = new Date((Long) jsonData.get("end"));
  		Boolean allDay = (Boolean) jsonData.get("allDay");
  		BigDecimal latitude = (BigDecimal) jsonData.get("latitude");
  		BigDecimal longitude = (BigDecimal) jsonData.get("longitude");
  		Long typeId = ((Number) jsonData.get("type_id")).longValue();

  		LocalEventType eventType = calendarController.findLocalEventType(typeId);
  		if (eventType == null) {
    		return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Could not find event type #" + typeId).build();
    	}
  		
    	LocalEvent localEvent = calendarController.createLocalEvent(localCalendar, eventType, summary, description, location, url, start, end, allDay, latitude, longitude);
    	
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
  		String data) {
  	
  	// TODO: Permissions
  	
  	LocalEvent localEvent = calendarController.findLocalEventById(eventId);
  	if (localEvent == null) {
  		return Response.status(Status.NOT_FOUND).build();
  	}
  	
  	if (!localEvent.getCalendar().getId().equals(calendarId)) {
  		return Response.status(Status.NOT_FOUND).build();
  	}

  	ObjectMapper mapper = new ObjectMapper();  
		Map<String, Object> jsonData;
		try {
			jsonData = mapper.readValue(data, new TypeReference<Map<String, Object>>() { });
		} catch (IOException e) {
			return Response.status(Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
		}

		Long typeId = ((Number) jsonData.get("type_id")).longValue();
		String summary = (String) jsonData.get("summary");
		String description = (String) jsonData.get("description");
		String location = (String) jsonData.get("location");
		String url = (String) jsonData.get("url");
		Date start = new Date((Long) jsonData.get("start"));
		Date end = new Date((Long) jsonData.get("end"));
		Boolean allDay = (Boolean) jsonData.get("allDay");
		BigDecimal latitude = (BigDecimal) jsonData.get("latitude");
		BigDecimal longitude = (BigDecimal) jsonData.get("longitude");

		LocalEventType eventType = calendarController.findLocalEventType(typeId);
		if (eventType == null) {
  		return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Could not find event type #" + typeId).build();
  	}
		
  	calendarController.updateLocalEvent(localEvent, eventType, summary, description, location, url, start, end, allDay, latitude, longitude);
  	
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
  
  @POST
  @Path ("/subscribedCalendars") 
  public Response createSubscribedCalendar(
  		@FormParam ("url") String url
  ) {
  	CalendarCategory calendarCategory = null;
  	
  	net.fortuna.ical4j.model.Calendar icsCalendar;
		try {
			icsCalendar = calendarController.loadIcsCalendar(url);
		} catch (IOException | ParserException | URISyntaxException e) {
  		// TODO: Localize
  		return Response.status(Status.BAD_REQUEST).entity("Could subscribe to calendar in " + url).build();
		}
		
  	if (icsCalendar == null) {
  		// TODO: Localize
  		return Response.status(Status.BAD_REQUEST).entity("Could subscribe to calendar in " + url).build();
  	}
  	
  	String name = calendarController.getIcsCalendarName(icsCalendar);
  	if (StringUtils.isBlank(name)) {
  		name = url;
  	}
  	
  	Environment environment = sessionController.getEnvironment();
  	UserEntity user = sessionController.getUser();

    UserCalendar subscribedUserCalendar = calendarController.createSubscribedUserCalendar(environment, user, calendarCategory, name, url);
    SubscribedCalendar subscribedCalendar = (SubscribedCalendar) subscribedUserCalendar.getCalendar();
    
    try {
			calendarController.synchronizeSubscribedCalendar(subscribedCalendar, icsCalendar);
		} catch (IOException | ParserException | URISyntaxException e) {
			logger.log(Level.SEVERE, "Calendar synchronization failed", e);
		}
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility();
  	
    return Response.ok(
    	tranquility.entity(subscribedCalendar)
    ).build();
  }
  
  @GET
  @Path ("/settings")
  public Response listSettings() {
  	UserEntity user = sessionController.getUser();
  	
  	Map<String, Object> settings = new HashMap<>();
  	
  	String firstDay = pluginSettingsController.getPluginUserSetting("calendar", CalendarPluginDescriptor.DEFAULT_FIRSTDAY_SETTING, user);
  	if (StringUtils.isBlank(firstDay)) {
  		firstDay = pluginSettingsController.getPluginSetting("calendar", CalendarPluginDescriptor.DEFAULT_FIRSTDAY_SETTING);
  	}
  	
  	settings.put("firstDay", firstDay);
  	
    return Response.ok(
      settings
    ).build();
  }
  
  @PUT
  @Path ("/settings")
  public Response updateSetting(String data) {
  	UserEntity user = sessionController.getUser();
  	
  	ObjectMapper mapper = new ObjectMapper();  
  	try {
			Map<String, String> jsonData = mapper.readValue(data, new TypeReference<Map<String, String>>() { });
			for (String key : jsonData.keySet()) {
				switch (key) {
					case "firstDay":
						pluginSettingsController.setPluginUserSetting("calendar", CalendarPluginDescriptor.DEFAULT_FIRSTDAY_SETTING, jsonData.get(key), user);
				  break;
					default:
						// TODO: Proper error handling
						throw new RuntimeException("Calendar setting " + key + " can not be updated");
				}
			}
		} catch (IOException e) {
		  return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}

    return Response.ok(data).build();
  }
  
  private class CalendarVisiblityValueGetter implements ValueGetter<Boolean> {
  	
  	public CalendarVisiblityValueGetter(List<UserCalendar> userCalendars) {
			for (UserCalendar userCalendar : userCalendars) {
				visibilities.put(userCalendar.getCalendar().getId(), userCalendar.getVisible());
			}
		}
  	
  	@Override
  	public Boolean getValue(TranquilizingContext context) {
  		Calendar calendar = (Calendar) context.getEntityValue();
  		return visibilities.get(calendar.getId());
  	}
  	
  	private Map<Long, Boolean> visibilities = new HashMap<>();
  }
}
