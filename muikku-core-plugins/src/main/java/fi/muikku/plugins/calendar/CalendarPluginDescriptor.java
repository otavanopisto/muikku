package fi.muikku.plugins.calendar;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.WidgetLocations;
import fi.muikku.controller.EnvironmentController;
import fi.muikku.controller.PluginSettingsController;
import fi.muikku.controller.UserController;
import fi.muikku.controller.WidgetController;
import fi.muikku.model.plugins.PluginUserSettingKey;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.widgets.DefaultWidget;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetLocation;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.RESTPluginDescriptor;
import fi.muikku.plugins.calendar.dao.CalendarDAO;
import fi.muikku.plugins.calendar.dao.EventDAO;
import fi.muikku.plugins.calendar.dao.LocalCalendarDAO;
import fi.muikku.plugins.calendar.dao.LocalEventDAO;
import fi.muikku.plugins.calendar.dao.LocalEventTypeDAO;
import fi.muikku.plugins.calendar.dao.SubscribedCalendarDAO;
import fi.muikku.plugins.calendar.dao.SubscribedEventDAO;
import fi.muikku.plugins.calendar.dao.UserCalendarDAO;
import fi.muikku.plugins.calendar.model.Calendar;
import fi.muikku.plugins.calendar.model.Event;
import fi.muikku.plugins.calendar.model.LocalAlert;
import fi.muikku.plugins.calendar.model.LocalCalendar;
import fi.muikku.plugins.calendar.model.LocalEvent;
import fi.muikku.plugins.calendar.model.LocalEventParticipant;
import fi.muikku.plugins.calendar.model.LocalEventType;
import fi.muikku.plugins.calendar.model.SubscribedCalendar;
import fi.muikku.plugins.calendar.model.SubscribedEvent;
import fi.muikku.plugins.calendar.model.UserCalendar;
import fi.muikku.plugins.calendar.rest.CalendarRESTService;
import fi.muikku.schooldata.entity.User;

@ApplicationScoped
@Stateful
public class CalendarPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor {

	public static final String DEFAULT_FIRSTDAY_SETTING = "defaultFirstDay";

	private static final String DEFAULT_FIRSTDAY = "1"; // Monday
	private static final String DEFAULT_COLOR = "#ff0000";

	@SuppressWarnings("unused")
	private static final String CALENDAR_CONTENT_SIDEBAR_LEFT = "calendar.contentSidebarLeft";
	private static final String CALENDAR_CONTENT_WIDGET_LOCATION = "calendar.content";
	private static final String CALENDAR_CONTENT_TOOLS_TOP_LEFT_WIDGET_LOCATION = "calendar.contentToolsTopLeft";
	private static final String CALENDAR_CONTENT_TOOLS_TOP_RIGHT_WIDGET_LOCATION = "calendar.contentToolsTopRight";
	
	private static final String FULLCALENDAR_WIDGET_NAME = "fullcalendar";
	private static final String MINICALENDAR_WIDGET_NAME = "minicalendar";
	private static final String DOCKCALENDAR_WIDGET_NAME = "dockcalendar";
	private static final String NEWCALENDAR_WIDGET_NAME = "newcalendar";
	private static final String NEWEVENT_WIDGET_NAME = "newevent";
	private static final String CALENDARSETTINGS_WIDGET_NAME = "calendarsettings";
	private static final String CALENDARSVISIBLE_WIDGET_NAME = "calendarsvisible";

	private static final String DEFAULT_EVENT_TYPE_ID_SETTING = "defaultEventTypeId";
	private static final String DEFAULT_EVENT_TYPE_NAME = "default";
	private static final String DEFAULT_CALENDAR_ID_SETTING = "defaultCalendarId";
	
	@Inject
	private CalendarController calendarController;

	@Inject
	private EnvironmentController environmentController;

	@Inject
	private UserController userController;

	@Inject
	private WidgetController widgetController;

	@Inject
	private PluginSettingsController pluginSettingsController;
	
	@Override
	public String getName() {
		return "calendar";
	}
	
	@Override
	public void init() {
  	// Make sure we have a default local event type
		
		LocalEventType defaultLocalEventType = null;
		Long defaultLocalEventTypeId = NumberUtils.createLong(pluginSettingsController.getPluginSetting(getName(), DEFAULT_EVENT_TYPE_ID_SETTING));
		if (defaultLocalEventTypeId != null) {
			defaultLocalEventType = calendarController.findLocalEventType(defaultLocalEventTypeId);
		} else {
			defaultLocalEventType = calendarController.createLocalEventType(DEFAULT_EVENT_TYPE_NAME);
			pluginSettingsController.setPluginSetting(getName(), DEFAULT_EVENT_TYPE_ID_SETTING, defaultLocalEventType.getId().toString());
		}

		// Make sure we have registered calendar widgets 

		Widget fullCalendarWidget = ensureWidget(FULLCALENDAR_WIDGET_NAME, WidgetVisibility.AUTHENTICATED);
		@SuppressWarnings("unused")
		Widget miniCalendarWidget = ensureWidget(MINICALENDAR_WIDGET_NAME, WidgetVisibility.AUTHENTICATED);
		Widget dockCalendarWidget = ensureWidget(DOCKCALENDAR_WIDGET_NAME, WidgetVisibility.AUTHENTICATED);
		Widget newCalendarWidget = ensureWidget(NEWCALENDAR_WIDGET_NAME, WidgetVisibility.AUTHENTICATED);
		Widget newEventWidget = ensureWidget(NEWEVENT_WIDGET_NAME, WidgetVisibility.AUTHENTICATED);
		Widget calendarSettingsWidget = ensureWidget(CALENDARSETTINGS_WIDGET_NAME, WidgetVisibility.AUTHENTICATED);
		Widget calendarsVisibleWidget = ensureWidget(CALENDARSVISIBLE_WIDGET_NAME, WidgetVisibility.AUTHENTICATED);

		// Add full widget as default to calendar content widget location
		
		ensureDefaultWidget(fullCalendarWidget, CALENDAR_CONTENT_WIDGET_LOCATION);
		
		/**
		// Add minicalendar as default to calendar content left sidebar and environment right sidebar
		ensureDefaultWidget(miniCalendarWidget, CALENDAR_CONTENT_SIDEBAR_LEFT);
		ensureDefaultWidget(miniCalendarWidget, WidgetLocations.ENVIRONMENT_CONTENT_SIDEBAR_RIGHT);
		**/
		
		// Add calendar widgets to their default locations

		ensureDefaultWidget(dockCalendarWidget, WidgetLocations.ENVIRONMENT_DOCK_TOP);
		ensureDefaultWidget(newEventWidget, CALENDAR_CONTENT_TOOLS_TOP_LEFT_WIDGET_LOCATION);
		ensureDefaultWidget(newCalendarWidget, CALENDAR_CONTENT_TOOLS_TOP_LEFT_WIDGET_LOCATION);
		ensureDefaultWidget(calendarsVisibleWidget, CALENDAR_CONTENT_TOOLS_TOP_RIGHT_WIDGET_LOCATION);
		ensureDefaultWidget(calendarSettingsWidget, CALENDAR_CONTENT_TOOLS_TOP_RIGHT_WIDGET_LOCATION);

		// Make sure every user has a default calendar

		PluginUserSettingKey defaultCalendarIdSetting = pluginSettingsController.getPluginUserSettingKey(getName(), DEFAULT_CALENDAR_ID_SETTING);

		List<UserEntity> usersWithoutDefaultCalendar = pluginSettingsController.listUsersWithoutSetting(defaultCalendarIdSetting);
		for (UserEntity userWithoutDefaultCalendar : usersWithoutDefaultCalendar) {
			User user = userController.findUser(userWithoutDefaultCalendar);
			String name = user.getFirstName() + ' ' + user.getLastName();
			UserCalendar calendar = calendarController.createLocalUserCalendar(userWithoutDefaultCalendar, name, DEFAULT_COLOR, Boolean.TRUE);
			pluginSettingsController.setPluginUserSetting(getName(), DEFAULT_CALENDAR_ID_SETTING, calendar.getCalendar().getId().toString(), userWithoutDefaultCalendar);
		}
		
		String defaultFirstDay = pluginSettingsController.getPluginSetting(getName(), DEFAULT_FIRSTDAY_SETTING);
		if (!DEFAULT_FIRSTDAY.equals(defaultFirstDay)) {
			pluginSettingsController.setPluginSetting(getName(), DEFAULT_FIRSTDAY_SETTING, DEFAULT_FIRSTDAY);
		}
	}

	private Widget ensureWidget(String name, WidgetVisibility visibility) {
		Widget widget = widgetController.findWidget(name);
		if (widget == null) {
			widget = widgetController.createWidget(name, visibility);
		}
		
		return widget;
	}

	private void ensureDefaultWidget(Widget widget, String location) {
		WidgetLocation widgetLocation = widgetController.findWidgetLocation(location);
		if (widgetLocation == null) {
			widgetLocation = widgetController.createWidgetLocation(location);
		}
		
		DefaultWidget defaultWidget = widgetController.findDefaultWidget(widget, widgetLocation);
		if (defaultWidget == null) {
			defaultWidget = widgetController.createDefaultWidget(widgetLocation, widget);
		}
	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
			/* DAOs */	
				
			CalendarDAO.class,
			EventDAO.class,
			LocalCalendarDAO.class,
			LocalEventDAO.class,
			LocalEventTypeDAO.class,
			SubscribedCalendarDAO.class,
			SubscribedEventDAO.class,
			UserCalendarDAO.class,
		  
		  /* Controllers */

		  CalendarController.class,
		  
		  /* Backing Beans */
		  
		  CalendarBackingBean.class,
		  
		  /* Schedulers */
		  
		  SubscribedCalendarUpdateScheduler.class
		));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
			Calendar.class,
			Event.class,
			LocalAlert.class,
			LocalCalendar.class,
			LocalEvent.class,
			LocalEventParticipant.class,
			LocalEventType.class,
			SubscribedCalendar.class,
			SubscribedEvent.class,
			UserCalendar.class
		};
	}
	
	@Override
	public Class<?>[] getRESTServices() {
		return new Class<?>[] {
			CalendarRESTService.class
		};
	}
}
