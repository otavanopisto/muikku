package fi.muikku.plugins.calendar;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import org.apache.commons.lang3.LocaleUtils;
import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
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

@ApplicationScoped
@Stateful
public class CalendarPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor {

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
	public String getName() {
		return "calendar";
	}
	
	@Override
	public void init() {
  	
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

}
