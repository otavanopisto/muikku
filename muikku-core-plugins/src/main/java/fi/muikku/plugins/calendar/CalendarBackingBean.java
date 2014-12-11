package fi.muikku.plugins.calendar;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.session.SessionController;

@Named
@RequestScoped
@Stateful
public class CalendarBackingBean {
	
	@Inject
	private SessionController sessionController;
	
	@Inject
	private PluginSettingsController pluginSettingsController;

	@PostConstruct
	public void init() {
    firstDay = pluginSettingsController.getPluginUserSetting("calendar", CalendarPluginDescriptor.DEFAULT_FIRSTDAY_SETTING, sessionController.getLoggedUserEntity());
    if (StringUtils.isBlank(firstDay)) {
      firstDay = pluginSettingsController.getPluginSetting("calendar", CalendarPluginDescriptor.DEFAULT_FIRSTDAY_SETTING);
    }
	}
	
	public String getFirstDay() {
		return firstDay;
	}
	
	private String firstDay;
}

