package fi.muikku.plugins.calendar;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.controller.EnvironmentController;
import fi.muikku.controller.PluginSettingsController;
import fi.muikku.controller.UserController;
import fi.muikku.controller.WidgetController;
import fi.muikku.model.base.Environment;
import fi.muikku.model.plugins.PluginUserSettingKey;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.widgets.DefaultWidget;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetLocation;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.PersistencePluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.RESTPluginDescriptor;
import fi.muikku.plugins.calendar.dao.CalendarCategoryDAO;
import fi.muikku.plugins.calendar.dao.CalendarDAO;
import fi.muikku.plugins.calendar.dao.EventDAO;
import fi.muikku.plugins.calendar.dao.LocalCalendarDAO;
import fi.muikku.plugins.calendar.dao.LocalEventDAO;
import fi.muikku.plugins.calendar.dao.LocalEventTypeDAO;
import fi.muikku.plugins.calendar.dao.SubscribedCalendarDAO;
import fi.muikku.plugins.calendar.dao.SubscribedEventDAO;
import fi.muikku.plugins.calendar.dao.UserCalendarDAO;
import fi.muikku.plugins.calendar.model.Calendar;
import fi.muikku.plugins.calendar.model.CalendarCategory;
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
	
	private static final String CALENDAR_CONTENT_WIDGET_LOCATION = "calendar.content";
	
	private static final String FULLCALENDAR_WIDGET_NAME = "fullcalendar";

	private static final String DEFAULT_CALENDAR_CATEGORY_ID_SETTING = "defaultCalendarCategoryId";
	private static final String DEFAULT_CALENDAR_CATEGORY_NAME = "default";
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
  	// Make sure we have a default calendar category and default local event type
		
		CalendarCategory defaultCalendarCategory = null;
		Long defaultCategoryId = NumberUtils.createLong(pluginSettingsController.getPluginSetting(getName(), DEFAULT_CALENDAR_CATEGORY_ID_SETTING));
		if (defaultCategoryId != null) {
			defaultCalendarCategory = calendarController.findCalendarCategoryById(defaultCategoryId);
		} else {
			defaultCalendarCategory = calendarController.createCalendarCategory(DEFAULT_CALENDAR_CATEGORY_NAME);
			pluginSettingsController.setPluginSetting(getName(), DEFAULT_CALENDAR_CATEGORY_ID_SETTING, defaultCalendarCategory.getId().toString());
		}
		
		LocalEventType defaultLocalEventType = null;
		Long defaultLocalEventTypeId = NumberUtils.createLong(pluginSettingsController.getPluginSetting(getName(), DEFAULT_EVENT_TYPE_ID_SETTING));
		if (defaultLocalEventTypeId != null) {
			defaultLocalEventType = calendarController.findLocalEventType(defaultLocalEventTypeId);
		} else {
			defaultLocalEventType = calendarController.createLocalEventType(DEFAULT_EVENT_TYPE_NAME);
			pluginSettingsController.setPluginSetting(getName(), DEFAULT_EVENT_TYPE_ID_SETTING, defaultLocalEventType.getId().toString());
		}

		// Make sure we have registered calendar widgets 
		
		Widget fullCalendarWidget = widgetController.findWidget(FULLCALENDAR_WIDGET_NAME);
		if (fullCalendarWidget == null) {
			fullCalendarWidget = widgetController.createWidget(FULLCALENDAR_WIDGET_NAME, WidgetVisibility.AUTHENTICATED);
		}

		// Add full widget as default to content widget location
		
		WidgetLocation calendarContentWidgetLocation = widgetController.findWidgetLocation(CALENDAR_CONTENT_WIDGET_LOCATION);
		if (calendarContentWidgetLocation == null) {
			calendarContentWidgetLocation = widgetController.createWidgetLocation(CALENDAR_CONTENT_WIDGET_LOCATION);
		}
		
		DefaultWidget fullCalendarDefaultWidget = widgetController.findDefaultWidget(fullCalendarWidget, calendarContentWidgetLocation);
		if (fullCalendarDefaultWidget == null) {
			fullCalendarDefaultWidget = widgetController.createDefaultWidget(calendarContentWidgetLocation, fullCalendarWidget);
		}
		
		// Make sure every user has a default calendar

		PluginUserSettingKey defaultCalendarIdSetting = pluginSettingsController.getPluginUserSettingKey(getName(), DEFAULT_CALENDAR_ID_SETTING);

		// TODO: Environment ???
		Environment environment = environmentController.listEnvironments().get(0);
		List<UserEntity> usersWithoutDefaultCalendar = pluginSettingsController.listUsersWithoutSetting(defaultCalendarIdSetting);
		for (UserEntity userWithoutDefaultCalendar : usersWithoutDefaultCalendar) {
			User user = userController.findUser(userWithoutDefaultCalendar);
			String name = user.getFirstName() + ' ' + user.getLastName();
			UserCalendar calendar = calendarController.createLocalUserCalendar(environment, userWithoutDefaultCalendar, defaultCalendarCategory, name);
			pluginSettingsController.setPluginUserSetting(getName(), DEFAULT_CALENDAR_ID_SETTING, calendar.getCalendar().getId().toString(), userWithoutDefaultCalendar);
		}

	}

	@Override
	public List<Class<?>> getBeans() {
		return new ArrayList<Class<?>>(Arrays.asList(
			/* DAOs */	
				
			CalendarDAO.class,
			CalendarCategoryDAO.class,
			EventDAO.class,
			LocalCalendarDAO.class,
			LocalEventDAO.class,
			LocalEventTypeDAO.class,
			SubscribedCalendarDAO.class,
			SubscribedEventDAO.class,
			UserCalendarDAO.class,
		  
		  /* Controllers */

		  CalendarController.class
		));
	}
	
	@Override
	public Class<?>[] getEntities() {
		return new Class<?>[] {
			Calendar.class,
			CalendarCategory.class,
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
