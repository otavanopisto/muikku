package fi.muikku.plugins.calendar;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.lang3.LocaleUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.controller.WidgetController;
import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.model.plugins.PluginUserSettingKey;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.AfterPluginsInitEvent;
import fi.muikku.plugin.LocalizedPluginDescriptor;
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
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.entity.User;

@ApplicationScoped
@Stateful
public class CalendarPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor {

	public static final String DEFAULT_FIRSTDAY_SETTING = "defaultFirstDay";

	private static final String DEFAULT_FIRSTDAY = "1"; // Monday
	private static final String DEFAULT_COLOR = "#ff0000";
	
	private static final String FULL_CALENDAR_WIDGET_WIDGET_LOCATION = WidgetLocations.CALENDAR_CONTENT;
	private static final String NEW_EVENT_WIDGET_LOCATION = WidgetLocations.CALENDAR_CONTENT_TOOLS_TOP_LEFT;
	private static final String NEW_CALENDAR_WIDGET_LOCATION = WidgetLocations.CALENDAR_CONTENT_TOOLS_TOP_LEFT;
	private static final String CALENDARS_VISIBLE_WIDGET_LOCATION = WidgetLocations.CALENDAR_CONTENT_TOOLS_TOP_RIGHT;
	private static final String CALENDAR_SETTINGS_WIDGET_LOCATION = WidgetLocations.CALENDAR_CONTENT_TOOLS_TOP_RIGHT;
	
	private static final int FULL_CALENDAR_WIDGET_MINIMUM_SIZE = 18;
	private static final int MINI_CALENDAR_WIDGET_MINIMUM_SIZE = 8;
	private static final int NEW_CALENDAR_WIDGET_MINIMUM_SIZE = 2;
	private static final int NEW_EVENT_WIDGET_MINIMUM_SIZE = 2;
	private static final int CALENDAR_SETTINGS_WIDGET_MINIMUM_SIZE = 2;
	private static final int CALENDARS_VISIBLE_WIDGET_MINIMUM_SIZE = 2;
	
	private static final String FULLCALENDAR_WIDGET_NAME = "fullcalendar";
	private static final String MINICALENDAR_WIDGET_NAME = "minicalendar";
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

		Widget fullCalendarWidget = widgetController.ensureWidget(FULLCALENDAR_WIDGET_NAME, FULL_CALENDAR_WIDGET_MINIMUM_SIZE, WidgetVisibility.AUTHENTICATED);
		@SuppressWarnings("unused")
		Widget miniCalendarWidget = widgetController.ensureWidget(MINICALENDAR_WIDGET_NAME, MINI_CALENDAR_WIDGET_MINIMUM_SIZE, WidgetVisibility.AUTHENTICATED);
		Widget newCalendarWidget = widgetController.ensureWidget(NEWCALENDAR_WIDGET_NAME, NEW_CALENDAR_WIDGET_MINIMUM_SIZE, WidgetVisibility.AUTHENTICATED);
		Widget newEventWidget = widgetController.ensureWidget(NEWEVENT_WIDGET_NAME, NEW_EVENT_WIDGET_MINIMUM_SIZE, WidgetVisibility.AUTHENTICATED);
		Widget calendarSettingsWidget = widgetController.ensureWidget(CALENDARSETTINGS_WIDGET_NAME, CALENDAR_SETTINGS_WIDGET_MINIMUM_SIZE, WidgetVisibility.AUTHENTICATED);
		Widget calendarsVisibleWidget = widgetController.ensureWidget(CALENDARSVISIBLE_WIDGET_NAME, CALENDARS_VISIBLE_WIDGET_MINIMUM_SIZE, WidgetVisibility.AUTHENTICATED);

		// Add full widget as default to calendar content widget location

		widgetController.ensureDefaultWidget(fullCalendarWidget, FULL_CALENDAR_WIDGET_WIDGET_LOCATION);
		
		/**
		// Add minicalendar as default to calendar content left sidebar and environment right sidebar
		ensureDefaultWidget(miniCalendarWidget, CALENDAR_CONTENT_SIDEBAR_LEFT);
		ensureDefaultWidget(miniCalendarWidget, WidgetLocations.ENVIRONMENT_CONTENT_SIDEBAR_RIGHT);
		**/
		
		// Add calendar widgets to their default locations
		
		widgetController.ensureDefaultWidget(newEventWidget, NEW_EVENT_WIDGET_LOCATION);
		widgetController.ensureDefaultWidget(newCalendarWidget, NEW_CALENDAR_WIDGET_LOCATION);
		widgetController.ensureDefaultWidget(calendarsVisibleWidget, CALENDARS_VISIBLE_WIDGET_LOCATION);
		widgetController.ensureDefaultWidget(calendarSettingsWidget, CALENDAR_SETTINGS_WIDGET_LOCATION);
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
		  
		  SubscribedCalendarUpdateScheduler.class,
		  
		  /* Seeker */
		  
      CalendarSeekerResultProvider.class
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

	@Override
	public List<LocaleBundle> getLocaleBundles() {
		return Arrays.asList(
	      new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.calendar.Messages", LocaleUtils.toLocale("fi"))),
	      new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.calendar.Messages", LocaleUtils.toLocale("en"))),
        new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.calendar.JsMessages", LocaleUtils.toLocale("fi"))),
        new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.calendar.JsMessages", LocaleUtils.toLocale("en")))
	  );
	}
	
	public void onAfterPluginsInit(@Observes AfterPluginsInitEvent event) {
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
}
