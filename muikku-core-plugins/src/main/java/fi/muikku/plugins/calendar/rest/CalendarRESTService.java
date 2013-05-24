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
import java.util.Set;
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
import net.sf.json.JSONObject;

import org.apache.commons.lang.math.NumberUtils;
import org.apache.commons.lang3.StringUtils;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.plugin.PluginRESTService;
import fi.muikku.plugins.calendar.CalendarController;
import fi.muikku.plugins.calendar.CalendarPluginDescriptor;
import fi.muikku.plugins.calendar.model.Calendar;
import fi.muikku.plugins.calendar.model.CalendarType;
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
  public Response listCalendars(@QueryParam ("calendarType") String calendarType) {
  	// TODO: Permissions
		// List all calendars user has permissions
  	
  	UserEntity user = sessionController.getUser();
  	List<UserCalendar> userCalendars = null;
  	List<Calendar> calendars = new ArrayList<>();
  	
		if (StringUtils.isBlank(calendarType)) {
			userCalendars = calendarController.listUserCalendars(user);
  	} else {
  		CalendarType type = CalendarType.valueOf(calendarType);
  		switch (type) {
  			case LOCAL:
  				userCalendars = calendarController.listUserLocalUserCalendars(user);
  			break;
  			case SUBSCRIBED:
  				userCalendars = calendarController.listUserSubscribedUserCalendars(user);
  			break;
  		}
  	}

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
  	
		JSONObject jsonData = JSONObject.fromObject(data);
		@SuppressWarnings("unchecked") Set<String> keys = jsonData.keySet();
		
		for (String key : keys) {
			switch (key) {
				case "visible":
					Boolean visible = jsonData.optBoolean("visible");
					if (visible != null) {
						calendarController.updateUserCalendarVisible(userCalendar, visible);
					}
			  break;
				case "name":
					String name = jsonData.optString("name");
					if (name != null) {
						calendarController.updateCalendarName(calendar, name);
					}
				break;
				default:
					// TODO: Proper error handling
					throw new RuntimeException("Calendar property " + key + " can not be updated");
			}
		}
  	
  	TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility();
    TranquilModelEntity entity = tranquility.entity(calendar);
  	
    return Response.ok(
    	entity
    ).build();
  }
  
  /**
   * Creates a new calendar.
   * 
   * Expects JSON -formatted string
   * 
   *  {
   *    "color": "hex string",
   *    "calendarType": "LOCAL"/"SUBSCRIBED",
   *    "visible": true/false,
   *    "name": when calendarType == LOCAL, a name of the calendar 
   *    "url": when calendarType == SUBSCRIBED, a url to the remote calendar
   *  }
   *  
   * Returns
   * 
   *  {
   *    "id": id
   *    "environment_id": environment id,
   *    "name": "Name of the calendar",
   *    "color": "hex string",
   *    "calendarType": "LOCAL"/"SUBSCRIBED",
   *    "visible": true/false,
   *    "url": when calendarType == SUBSCRIBED, a url to the remote calendar
   *  }
   */

  @POST
  @Path ("/calendars") 
  public Response createCalendar(String data) {
  	
  	JSONObject jsonData = JSONObject.fromObject(data);
  	
  	// TODO: Better error handling
  	String color = jsonData.getString("color");
  	CalendarType calendarType = CalendarType.valueOf(jsonData.getString("calendarType"));
  	Boolean visibile = jsonData.getBoolean("visible");
  	String name = null;
  	UserCalendar userCalendar = null;
  	
  	UserEntity user = sessionController.getUser();
  	
  	switch (calendarType) {
  		case LOCAL:
  			name = jsonData.getString("name");
  			userCalendar = calendarController.createLocalUserCalendar(user, name, color, visibile);
  	  break;
  		case SUBSCRIBED:
  			String url = jsonData.getString("url");
  			
  			net.fortuna.ical4j.model.Calendar icsCalendar;
  			try {
  				icsCalendar = calendarController.loadIcsCalendar(StringUtils.trim(url));
  			} catch (IOException | ParserException | URISyntaxException e) {
  	  		// TODO: Localize
  	  		return Response.status(Status.BAD_REQUEST).entity("Could subscribe to calendar in " + url).build();
  			}
  			
  	  	if (icsCalendar == null) {
  	  		// TODO: Localize
  	  		return Response.status(Status.BAD_REQUEST).entity("Could subscribe to calendar in " + url).build();
  	  	}
  	  	
  	  	name = calendarController.getIcsCalendarName(icsCalendar);
  	  	if (StringUtils.isBlank(name)) {
  	  		name = url;
  	  	}
  	  	
  	  	userCalendar = calendarController.createSubscribedUserCalendar(user, name, url, color, visibile);
  	  	
  	  	try {
  				calendarController.synchronizeSubscribedCalendar((SubscribedCalendar) userCalendar.getCalendar(), icsCalendar);
  			} catch (IOException | ParserException | URISyntaxException e) {
  				logger.log(Level.SEVERE, "Calendar synchronization failed", e);
  			}
  	  	
  		break;
  	}
    
    TranquilityBuilder tranquilityBuilder = tranquilityBuilderFactory.createBuilder();
    Tranquility tranquility = tranquilityBuilder.createTranquility()
    		.addInstruction(new SuperClassInstructionSelector(Calendar.class), tranquilityBuilder.createPropertyInjectInstruction("visible", new CalendarVisiblityValueGetter(Arrays.asList(userCalendar))));

    return Response.ok(
    	tranquility.entity(userCalendar.getCalendar())
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

  		JSONObject jsonData = JSONObject.fromObject(data);

  		String summary = jsonData.optString("summary");
  		String description = jsonData.optString("description");
  		String location = jsonData.optString("location");
  		String url = jsonData.optString("url");
  		Date start = new Date(jsonData.optLong("start"));
  		Date end = new Date(jsonData.optLong("end"));
  		Boolean allDay = jsonData.optBoolean("allDay");
  		BigDecimal latitude = getBigDecimal(jsonData, "latitude");
  		BigDecimal longitude = getBigDecimal(jsonData, "longitude");
  		Long typeId = jsonData.optLong("type_id");

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
  	
  	JSONObject jsonData = JSONObject.fromObject(data);

		Long targetCalendarId = jsonData.optLong("calendar_id");
		Long typeId = jsonData.optLong("type_id");
		String summary = jsonData.optString("summary");
		String description = jsonData.optString("description");
		String location = jsonData.optString("location");
		String url = jsonData.optString("url");
		Date start = new Date(jsonData.optLong("start"));
		Date end = new Date(jsonData.optLong("end"));
		Boolean allDay = jsonData.optBoolean("allDay");
		BigDecimal latitude = getBigDecimal(jsonData, "latitude");
		BigDecimal longitude = getBigDecimal(jsonData, "longitude");
		
		LocalEventType eventType = calendarController.findLocalEventType(typeId);
		if (eventType == null) {
  		return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Could not find event type #" + typeId).build();
  	}
		
		calendarController.updateLocalEvent(localEvent, eventType, summary, description, location, url, start, end, allDay, latitude, longitude);
  	if ((targetCalendarId != null) && (targetCalendarId != calendarId)) {
  		// Event has been moved into new calendar
  		// TODO: Check that user has permission to target calendar
  		LocalCalendar targetCalendar = (LocalCalendar) calendarController.findCalendar(targetCalendarId);
  		calendarController.updateLocalEventCalendar(localEvent, targetCalendar);
  	}
  	
  	
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
  	
  	JSONObject jsonData = JSONObject.fromObject(data);
  	@SuppressWarnings("unchecked") Set<String> keys = jsonData.keySet();
  	
		for (String key : keys) {
			switch (key) {
				case "firstDay":
					pluginSettingsController.setPluginUserSetting("calendar", CalendarPluginDescriptor.DEFAULT_FIRSTDAY_SETTING, jsonData.getString(key), user);
			  break;
				default:
					// TODO: Proper error handling
					throw new RuntimeException("Calendar setting " + key + " can not be updated");
			}
		}

    return Response.ok(data).build();
  }

	private BigDecimal getBigDecimal(JSONObject jsonData, String key) {
		Object object = jsonData.get(key);
		if (object == null) {
			return null;
		}
		
		String value = null;
		
		if (object instanceof JSONObject) {
			JSONObject jsonObject = (JSONObject) object;
			
  		if (jsonObject.isNullObject()) {
  			return null;
  		}
  
  		value = jsonObject.toString();
		} else if (object instanceof String) {
			value = (String) object;
		}

		return NumberUtils.createBigDecimal(value);
	}
  
  public static class CalendarVisiblityValueGetter implements ValueGetter<Boolean> {
  	
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
