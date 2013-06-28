package fi.muikku.plugins.calendar;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.session.SessionController;
import fi.muikku.widgets.WidgetSpaceSet;
import fi.muikku.widgets.WidgetSpaceSetItem;
import fi.muikku.widgets.WidgetSpaceSizingStrategy;

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
		String firstDay = pluginSettingsController.getPluginUserSetting("calendar", CalendarPluginDescriptor.DEFAULT_FIRSTDAY_SETTING, sessionController.getUser());
		if (StringUtils.isBlank(firstDay)) {
			firstDay = pluginSettingsController.getPluginSetting("calendar", CalendarPluginDescriptor.DEFAULT_FIRSTDAY_SETTING);
		}
		
		return firstDay;
	}
	
	public WidgetSpaceSet getContentToolsTopWidgetSpaceSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.CALENDAR_CONTENT_TOOLS_TOP_LEFT, false, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.CALENDAR_CONTENT_TOOLS_TOP_RIGHT, false, WidgetSpaceSizingStrategy.SUM)
		);
	}
	
	public WidgetSpaceSet getContentWidgetSpaceSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.CALENDAR_CONTENT_SIDEBAR_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.CALENDAR_CONTENT, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.CALENDAR_CONTENT_SIDEBAR_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}
	
}

