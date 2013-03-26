package fi.muikku.plugins.calendar;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.EnvironmentController;
import fi.muikku.controller.UserController;
import fi.muikku.controller.WidgetController;
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

@ApplicationScoped
@Stateful
public class CalendarPluginDescriptor implements PluginDescriptor, PersistencePluginDescriptor, RESTPluginDescriptor {
	
	private static final String CALENDAR_CONTENT_WIDGET_LOCATION = "calendar.content";
	
	private static final String FULLCALENDAR_WIDGET_NAME = "fullcalendar";
	
	@Inject
	private CalendarController calendarController;

	@Inject
	private EnvironmentController environmentController;

	@Inject
	private UserController userController;

	@Inject
	private WidgetController widgetController;
	
	@Override
	public String getName() {
		return "calendar";
	}
	
	@Override
	public void init() {
  	// Make sure we have a default calendar type
		calendarController.getDefaultCalendarCategory(true);
		
		calendarController.getDefaultLocalEventType(true);
		
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
