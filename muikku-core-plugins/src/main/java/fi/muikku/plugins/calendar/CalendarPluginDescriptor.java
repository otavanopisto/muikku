package fi.muikku.plugins.calendar;

import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import javax.annotation.PostConstruct;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import org.apache.commons.lang3.LocaleUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.model.plugins.PluginUserSettingKey;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugin.AfterPluginsInitEvent;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.calendar.model.LocalEventType;
import fi.muikku.plugins.calendar.model.UserCalendar;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.entity.User;

public class CalendarPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {

	public static final String DEFAULT_FIRSTDAY_SETTING = "defaultFirstDay";

	private static final String DEFAULT_FIRSTDAY = "1"; // Monday
	private static final String DEFAULT_COLOR = "#ff0000";

	private static final String DEFAULT_EVENT_TYPE_ID_SETTING = "defaultEventTypeId";
	private static final String DEFAULT_EVENT_TYPE_NAME = "default";
	private static final String DEFAULT_CALENDAR_ID_SETTING = "defaultCalendarId";
	
	@Inject
	private CalendarController calendarController;

	@Inject
	private UserController userController;
	
	@Inject
	private PluginSettingsController pluginSettingsController;
	
	@Override
	public String getName() {
		return "calendar";
	}
	
	@PostConstruct
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
			if (user != null) {
			  String name = user.getFirstName() + ' ' + user.getLastName();
			  UserCalendar calendar = calendarController.createLocalUserCalendar(userWithoutDefaultCalendar, name, DEFAULT_COLOR, Boolean.TRUE);
  			pluginSettingsController.setPluginUserSetting(getName(), DEFAULT_CALENDAR_ID_SETTING, calendar.getCalendar().getId().toString(), userWithoutDefaultCalendar);
			}
		}
		
		String defaultFirstDay = pluginSettingsController.getPluginSetting(getName(), DEFAULT_FIRSTDAY_SETTING);
		if (!DEFAULT_FIRSTDAY.equals(defaultFirstDay)) {
			pluginSettingsController.setPluginSetting(getName(), DEFAULT_FIRSTDAY_SETTING, DEFAULT_FIRSTDAY);
		}
	}
}
