package fi.muikku.plugins.calendar;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.session.SessionController;

@Named
@Dependent
public class CalendarBackingBean {

	@Inject
	private CalendarController calendarController;
	
	@Inject
	private SessionController sessionController;
	
	@Inject
	private PluginSettingsController pluginSettingsController;
	
	public String getFirstDay() {
		String firstDay = pluginSettingsController.getPluginUserSetting("calendar", CalendarPluginDescriptor.DEFAULT_FIRSTDAY_SETTING, sessionController.getLoggedUserEntity());
		if (StringUtils.isBlank(firstDay)) {
			firstDay = pluginSettingsController.getPluginSetting("calendar", CalendarPluginDescriptor.DEFAULT_FIRSTDAY_SETTING);
		}
		
		return firstDay;
	}
	
}

