package fi.otavanopisto.muikku.plugins.calendar;

import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.i18n.LocaleBundle;
import fi.otavanopisto.muikku.i18n.LocaleLocation;
import fi.otavanopisto.muikku.plugin.LocalizedPluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class CalendarPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {

	public static final String DEFAULT_FIRSTDAY_SETTING = "defaultFirstDay";
//
//	private static final String DEFAULT_FIRSTDAY = "1"; // Monday
//	private static final String DEFAULT_COLOR = "#ff0000";
//
//	private static final String DEFAULT_EVENT_TYPE_ID_SETTING = "defaultEventTypeId";
//	private static final String DEFAULT_EVENT_TYPE_NAME = "default";
//	private static final String DEFAULT_CALENDAR_ID_SETTING = "defaultCalendarId";
//	
  @Override
  public void init() {
  }

	@Override
	public String getName() {
		return "calendar";
	}
	
	@Override
	public List<LocaleBundle> getLocaleBundles() {
		return Arrays.asList(
	      new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.calendar.Messages", LocaleUtils.toLocale("fi"))),
	      new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.calendar.Messages", LocaleUtils.toLocale("en"))),
        new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.calendar.JsMessages", LocaleUtils.toLocale("fi"))),
        new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.calendar.JsMessages", LocaleUtils.toLocale("en")))
	  );
	}

}
