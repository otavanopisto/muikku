	package fi.muikku.plugins.calendar;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.data.ParserException;
import net.fortuna.ical4j.model.Component;
import net.fortuna.ical4j.model.Property;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.Description;
import net.fortuna.ical4j.model.property.DtEnd;
import net.fortuna.ical4j.model.property.DtStart;
import net.fortuna.ical4j.model.property.Geo;
import net.fortuna.ical4j.model.property.Location;
import net.fortuna.ical4j.model.property.Summary;
import net.fortuna.ical4j.model.property.Uid;
import net.fortuna.ical4j.model.property.Url;

import org.apache.commons.lang3.time.DateUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import fi.muikku.model.base.Environment;
import fi.muikku.model.stub.users.UserEntity;
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
import fi.muikku.plugins.calendar.model.LocalCalendar;
import fi.muikku.plugins.calendar.model.LocalEvent;
import fi.muikku.plugins.calendar.model.LocalEventType;
import fi.muikku.plugins.calendar.model.SubscribedCalendar;
import fi.muikku.plugins.calendar.model.UserCalendar;

@Dependent
@Stateful
public class CalendarController {
	
	@Inject
	private Logger logger;
	
	@Inject
	private CalendarCategoryDAO calendarCategoryDAO;

	@Inject
	private CalendarDAO calendarDAO;

	@Inject
	private EventDAO eventDAO;

	@Inject
	private UserCalendarDAO userCalendarDAO;

	@Inject
	private LocalCalendarDAO localCalendarDAO;

	@Inject
	private LocalEventDAO localEventDAO;
	
	@Inject
	private LocalEventTypeDAO localEventTypeDAO;

	@Inject
	private SubscribedCalendarDAO subscribedCalendarDAO;
	
	@Inject
	private SubscribedEventDAO subscribedEventDAO;
	
	/* CalendarCategory */

	public CalendarCategory createCalendarCategory(String name) {
		return calendarCategoryDAO.create(name);
	}
	
	public CalendarCategory findCalendarCategoryById(Long id) {
		return calendarCategoryDAO.findById(id);
	}

	public List<CalendarCategory> listCalendarCategories() {
		return calendarCategoryDAO.listAll();
	}
	
	public List<UserCalendar> listUserCalendars(Environment environment, UserEntity user) {
		return userCalendarDAO.listByEnvironmentIdAndUserId(environment.getId(), user.getId());
	}

	/* Calendar */

	public Calendar findCalendar(Long calendarId) {
		return calendarDAO.findById(calendarId);
	}
	
	public List<Calendar> listCalendars(Environment environment, UserEntity user) {
		List<Calendar> result = new ArrayList<>();
		List<UserCalendar> userCalendars = userCalendarDAO.listByEnvironmentIdAndUserId(environment.getId(), user.getId());
		for (UserCalendar userCalendar : userCalendars) {
			result.add(userCalendar.getCalendar());
		}
		return result;
	}
	
	/* LocalCalendar */
	
	public UserCalendar createLocalUserCalendar(Environment environment, UserEntity user, CalendarCategory calendarCategory, String name) {
		LocalCalendar localCalendar = localCalendarDAO.create(environment.getId(), calendarCategory, name);
		UserCalendar userCalendar = userCalendarDAO.create(localCalendar, environment.getId(), user.getId());
		return userCalendar;
	}

	public List<LocalCalendar> listUserLocalCalendars(Environment environment, UserEntity user) {
		List<LocalCalendar> result = new ArrayList<>();
		List<UserCalendar> userCalendars = listUserCalendars(environment, user);
		for (UserCalendar userCalendar : userCalendars) {
		  if (userCalendar.getCalendar() instanceof LocalCalendar) {
		  	result.add((LocalCalendar) userCalendar.getCalendar()); 
		  }	
		}
		
		return result;
	}

	/* SubscribedCalendar */
	
	public UserCalendar createSubscribedUserCalendar(Environment environment, UserEntity user, CalendarCategory calendarCategory, String name, String url) {
		SubscribedCalendar subscribedCalendar = subscribedCalendarDAO.create(environment.getId(), calendarCategory, name, url);
		UserCalendar userCalendar = userCalendarDAO.create(subscribedCalendar, environment.getId(), user.getId());
		return userCalendar;
	}

	public UserCalendar findSubscribedUserCalendar(Environment environment, UserEntity userEntity, String url) {
		List<UserCalendar> userCalendars = userCalendarDAO.listByEnvironmentIdAndUserId(environment.getId(), userEntity.getId());
		for (UserCalendar userCalendar : userCalendars) {
			if (userCalendar.getCalendar() instanceof SubscribedCalendar) {
				SubscribedCalendar subscribedCalendar = (SubscribedCalendar) userCalendar.getCalendar();
				if (subscribedCalendar.getUrl().equals(url))
					return userCalendar;
			}
		}
		
		return null;
	}

	@SuppressWarnings("unchecked")
	public void synchronizeSubscribedCalendar(SubscribedCalendar subscribedCalendar) throws IOException, ParserException, URISyntaxException {
		net.fortuna.ical4j.model.Calendar icsCalendar = loadIcsCalendar(subscribedCalendar.getUrl());
		Iterator<Component> componentIterator = icsCalendar.getComponents().iterator();
		while (componentIterator.hasNext()) {
			Component component = componentIterator.next();
			if (component instanceof VEvent) {
				VEvent event = (VEvent) component;
				
				Uid uid = event.getUid();
				if (uid != null) {
  				Description description = event.getDescription();
  				Summary summary = event.getSummary();
  				DtStart startDate = event.getStartDate();
  				DtEnd endDate = event.getEndDate();
  				Url eventUrl = event.getUrl();
  				Location location = event.getLocation();
  				Geo geographicPos = event.getGeographicPos();
  				
  				// TODO: Update...
  			  // TODO: Repeats, Alerts, Invitees
  				
  				subscribedEventDAO.create(
   					subscribedCalendar, 
  					uid.getValue(), 
  					summary != null ? summary.getValue() : null, 
  					description != null ? description.getValue() : null,
						location != null ? location.getValue() : null,
						startDate.getDate(), 
  					endDate.getDate(), 
  					eventUrl != null ? eventUrl.getValue() : null,
  					isAllDayIcsEvent(event),
  	  			geographicPos != null ? geographicPos.getLatitude() : null,
  	  			geographicPos != null ? geographicPos.getLongitude(): null
  				);
				} else {
					logger.warning("Skiped " + subscribedCalendar.getId() + " event because no uid could be found.");
				}
			}
		}
	}
	
	/* LocalEvents */

	public LocalEvent createLocalEvent(LocalCalendar calendar, LocalEventType type, String summary, String description, String location, String url, Date start, Date end, Boolean allDay, BigDecimal latitude, BigDecimal longitude) {
		return localEventDAO.create(calendar, type, summary, description, location, url, start, end, allDay, latitude, longitude);
	}

	public LocalEvent findLocalEventById(Long id) {
		return localEventDAO.findById(id);
	}
	
	public LocalEvent updateLocalEvent(LocalEvent localEvent, LocalEventType type, String summary, String description, String location, String url, Date start, Date end, Boolean allDay, BigDecimal latitude, BigDecimal longitude) {
		
		localEventDAO.updateType(localEvent, type);
		localEventDAO.updateSummary(localEvent, summary);
		localEventDAO.updateDescription(localEvent, description);
		localEventDAO.updateLocation(localEvent, location);
		localEventDAO.updateUrl(localEvent, url);
		localEventDAO.updateStart(localEvent, start);
		localEventDAO.updateEnd(localEvent, end);
		localEventDAO.updateAllDay(localEvent, allDay);
		localEventDAO.updateLatitude(localEvent, latitude);
		localEventDAO.updateLongitude(localEvent, longitude);
		
		return localEvent;
	}
	
	/* Events */
	
	public List<Event> listCalendarEvents(Calendar calendar) {
	  return listCalendarEvents(calendar, null, null);
	}
	
	public List<Event> listCalendarEvents(Calendar calendar, Date timeMin, Date timeMax) {
		// TODO: This should be inclusive!
		
		
		if (timeMin != null && timeMax == null) {
			return eventDAO.listByCalendarStartTimeGe(calendar, timeMin);
		} else if (timeMin == null && timeMax != null) {
			return eventDAO.listByCalendarEndTimeLe(calendar, timeMax);
		} else if (timeMin != null && timeMax != null) {
			return eventDAO.listByCalendarStartTimeGeEndTimeLe(calendar, timeMin, timeMax);	
		} else {
			return eventDAO.listByCalendar(calendar);
		}
	}
	
	/* LocalEventType */
	
	public LocalEventType createLocalEventType(String name) {
		return localEventTypeDAO.create(name);
	}

	public LocalEventType findLocalEventType(Long id) {
		return localEventTypeDAO.findById(id);
	}

	public List<LocalEventType> listLocalEventTypes() {
		return localEventTypeDAO.listAll();
	}
	
	/* Private */
	
	private net.fortuna.ical4j.model.Calendar loadIcsCalendar(String url) throws IOException, ParserException, URISyntaxException {
		DefaultHttpClient httpClient = new DefaultHttpClient();
		
		SchemeRegistry schemeRegistry = httpClient.getConnectionManager().getSchemeRegistry();
		if (!schemeRegistry.getSchemeNames().contains("webcal")) {
		  schemeRegistry.register(new Scheme("webcal", 80, PlainSocketFactory.getSocketFactory()));
		}
		
		HttpGet httpGet = new HttpGet(new URI(url));
		
		HttpResponse response = httpClient.execute(httpGet);
		if (response.getStatusLine().getStatusCode() == 200) {
		  HttpEntity entity = response.getEntity();
		  try {
		  	InputStream content = entity.getContent();
		  	try {
			  	CalendarBuilder builder = new CalendarBuilder();
			  	return builder.build(content);
		  	} finally {
		  		content.close();
		  	}
		  } finally {
		  	EntityUtils.consume(entity);
		  }
		} else {
			throw new IOException(response.getStatusLine().getReasonPhrase());
		}
	}
	
	private boolean isAllDayIcsEvent(VEvent event) {
		// Scan X-FUNAMBOL-ALLDAY and X-MICROSOFT-CDO-ALLDAYEVENT extensions for all-day info
		
		Boolean extensionAllDay = getBooleanIcsComponentProperty(event, "X-FUNAMBOL-ALLDAY");
		if (extensionAllDay != null) {
			return extensionAllDay;
		}
		
		extensionAllDay = getBooleanIcsComponentProperty(event, "X-MICROSOFT-CDO-ALLDAYEVENT");
		if (extensionAllDay != null) {
			return extensionAllDay;
		}
		
		// If extensions are not defined we try to figure it out from the start and end dates
		
		long millisecondsBetween = event.getEndDate().getDate().getTime() - event.getStartDate().getDate().getTime();
		if (millisecondsBetween < DateUtils.MILLIS_PER_DAY) {
			return false;
		} else {
			return true;
		}

	}
	
	private Boolean getBooleanIcsComponentProperty(Component component, String propertyName) {
		Property property = component.getProperty(propertyName);
		if (property != null) {
			return "1".equals(property.getValue());
		}
		
		return null;
	}
}
