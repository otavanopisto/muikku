	package fi.muikku.plugins.calendar;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
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

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import fi.muikku.model.stub.users.UserEntity;
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
import fi.muikku.plugins.calendar.model.LocalCalendar;
import fi.muikku.plugins.calendar.model.LocalEvent;
import fi.muikku.plugins.calendar.model.LocalEventType;
import fi.muikku.plugins.calendar.model.SubscribedCalendar;
import fi.muikku.plugins.calendar.model.SubscribedEvent;
import fi.muikku.plugins.calendar.model.UserCalendar;

@Dependent
@Stateful
public class CalendarController {
	
	@Inject
	private Logger logger;

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
	
	/* UserCalendar */
	
	public List<UserCalendar> listUserCalendars(UserEntity user) {
		return userCalendarDAO.listByUserId(user.getId());
	}

	/* Calendar */

	public Calendar findCalendar(Long calendarId) {
		return calendarDAO.findById(calendarId);
	}
	
	public List<Calendar> listCalendars(UserEntity user) {
		List<Calendar> result = new ArrayList<>();
		List<UserCalendar> userCalendars = userCalendarDAO.listByUserId(user.getId());
		for (UserCalendar userCalendar : userCalendars) {
			result.add(userCalendar.getCalendar());
		}
		return result;
	}

	public Calendar updateCalendarName(Calendar calendar, String name) {
		return calendarDAO.updateName(calendar, name);
	}
	
	/* LocalCalendar */
	
	public UserCalendar createLocalUserCalendar(UserEntity user, String name, String color, Boolean visible) {
		LocalCalendar localCalendar = localCalendarDAO.create(name, color);
		UserCalendar userCalendar = userCalendarDAO.create(localCalendar, user.getId(), visible);
		return userCalendar;
	}

	public List<LocalCalendar> listUserLocalCalendars(UserEntity user) {
		List<LocalCalendar> result = new ArrayList<>();
		List<UserCalendar> userCalendars = listUserCalendars(user);
		for (UserCalendar userCalendar : userCalendars) {
		  if (userCalendar.getCalendar() instanceof LocalCalendar) {
		  	result.add((LocalCalendar) userCalendar.getCalendar()); 
		  }	
		}
		
		return result;
	}

	public List<UserCalendar> listUserLocalUserCalendars(UserEntity user) {
		List<UserCalendar> result = new ArrayList<>();
		List<UserCalendar> userCalendars = listUserCalendars(user);
		for (UserCalendar userCalendar : userCalendars) {
		  if (userCalendar.getCalendar() instanceof LocalCalendar) {
		  	result.add(userCalendar); 
		  }	
		}
		
		return result;
	}

	/* SubscribedCalendar */
	
	public UserCalendar createSubscribedUserCalendar(UserEntity user, String name, String url, String color, Boolean visible, Date lastSynchronized) {
		SubscribedCalendar subscribedCalendar = subscribedCalendarDAO.create(name, url, color, lastSynchronized);
		UserCalendar userCalendar = userCalendarDAO.create(subscribedCalendar, user.getId(), visible);
		return userCalendar;
	}

	public UserCalendar findSubscribedUserCalendar(UserEntity userEntity, String url) {
		List<UserCalendar> userCalendars = userCalendarDAO.listByUserId(userEntity.getId());
		for (UserCalendar userCalendar : userCalendars) {
			if (userCalendar.getCalendar() instanceof SubscribedCalendar) {
				SubscribedCalendar subscribedCalendar = (SubscribedCalendar) userCalendar.getCalendar();
				if (subscribedCalendar.getUrl().equals(url))
					return userCalendar;
			}
		}
		
		return null;
	}

	public List<UserCalendar> listUserSubscribedUserCalendars(UserEntity user) {
		List<UserCalendar> result = new ArrayList<>();
		List<UserCalendar> userCalendars = listUserCalendars(user);
		for (UserCalendar userCalendar : userCalendars) {
		  if (userCalendar.getCalendar() instanceof SubscribedCalendar) {
		  	result.add(userCalendar); 
		  }	
		}
		
		return result;
	}

	public List<SubscribedCalendar> listUserSubscribedCalendars(UserEntity user) {
		List<SubscribedCalendar> result = new ArrayList<>();
		
		List<UserCalendar> userCalendars = listUserCalendars(user);
		for (UserCalendar userCalendar : userCalendars) {
		  if (userCalendar.getCalendar() instanceof SubscribedCalendar) {
		  	result.add((SubscribedCalendar) userCalendar.getCalendar()); 
		  }	
		}
		
		return result;
	}

	public net.fortuna.ical4j.model.Calendar loadIcsCalendar(String url) throws IOException, ParserException, URISyntaxException {
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
	
	public String getIcsCalendarName(net.fortuna.ical4j.model.Calendar calendar) {
		Property property = calendar.getProperty("X-WR-CALNAME");
		if (property != null && StringUtils.isNotBlank(property.getValue())) {
			// Check for X-WR-CALNAME extension
			return property.getValue();
		}
		
		// If name could not be found from extension calendar does not contain name information
		return null;
	}
	
	public boolean isAllDayIcsEvent(VEvent event) {
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
		if (event.getEndDate() == null) {
			return true;
		}
		
		long millisecondsBetween = event.getEndDate().getDate().getTime() - event.getStartDate().getDate().getTime();
		if (millisecondsBetween < DateUtils.MILLIS_PER_DAY) {
			return false;
		} else {
			return true;
		}

	}
	
	/**
	 * Checks for Google's X-GOOGLE-HANGOUT extension 
	 * 
	 * @return Hangout url or null if not present
	 */
	private String getHangoutUrl(VEvent event) {
		Property property = event.getProperty("X-GOOGLE-HANGOUT");
		if (property != null) {
			String url = property.getValue();
			if (StringUtils.isNotBlank(url)) {
				return url;
			}
		}
		
		return null;
	}

	@SuppressWarnings("unchecked")
  public void synchronizeSubscribedCalendar(SubscribedCalendar subscribedCalendar, net.fortuna.ical4j.model.Calendar icsCalendar) throws IOException, ParserException, URISyntaxException {
		Set<String> removedUids = new HashSet<>();
		
		List<SubscribedEvent> existingEvents = subscribedEventDAO.listByCalendar(subscribedCalendar);
		for (SubscribedEvent existingEvent : existingEvents) {
			removedUids.add(existingEvent.getUid());
		}
		
		Iterator<Component> componentIterator = icsCalendar.getComponents().iterator();
		while (componentIterator.hasNext()) {
			Component component = componentIterator.next();
			if (component instanceof VEvent) {
				VEvent event = (VEvent) component;
				
				Uid uidObject = event.getUid();
				if (uidObject != null) {
  				Description descriptionObject = event.getDescription();
  				Summary summaryObject = event.getSummary();
  				DtStart startDate = event.getStartDate();
  				DtEnd endDate = event.getEndDate();
  				Url eventUrlObject = event.getUrl();
  				Location locationObject = event.getLocation();
  				Geo geographicPosObject = event.getGeographicPos();
  				String uid = uidObject.getValue();
		
  				if (startDate == null) {
  					logger.warning("Subscribed event " + uid + " does not have a start date. Skipping");
  					continue;
  				}
  				
  				Date start = startDate.getDate();
  				Date end = endDate == null ? start : endDate.getDate();
  				boolean allDay = isAllDayIcsEvent(event);
  				String summary = summaryObject != null ? summaryObject.getValue() : null;
  				String description = descriptionObject != null ? descriptionObject.getValue() : null;
  				String location = locationObject != null ? locationObject.getValue() : null;
  				String eventUrl = eventUrlObject != null ? eventUrlObject.getValue() : null;
  				BigDecimal latitude = geographicPosObject != null ? geographicPosObject.getLatitude() : null;
  				BigDecimal longitude = geographicPosObject != null ? geographicPosObject.getLongitude(): null;
  				String hangoutUrl = getHangoutUrl(event);
  				
  				SubscribedEvent subscribedEvent = subscribedEventDAO.findByCalendarAndUid(subscribedCalendar, uid);
  				if (subscribedEvent == null) { 
    				subscribedEventDAO.create(subscribedCalendar, uid, summary, description, location, start, end, eventUrl, allDay, latitude, longitude, hangoutUrl);
  				} else {
  					subscribedEventDAO.updateSummary(subscribedEvent, summary);
  					subscribedEventDAO.updateDescription(subscribedEvent, description);
  					subscribedEventDAO.updateLocation(subscribedEvent, location);
  					subscribedEventDAO.updateStart(subscribedEvent, start);
  					subscribedEventDAO.updateEnd(subscribedEvent, end);
  					subscribedEventDAO.updateUrl(subscribedEvent, eventUrl);
  					subscribedEventDAO.updateAllDay(subscribedEvent, allDay);
  					subscribedEventDAO.updateLatitude(subscribedEvent, latitude);
  					subscribedEventDAO.updateLongitude(subscribedEvent, longitude);
  					subscribedEventDAO.updateHangoutUrl(subscribedEvent, hangoutUrl);
  				}
  				
  				removedUids.remove(uid);
				} else {
					logger.warning("Skiped " + subscribedCalendar.getId() + " event because no uid could be found.");
				}
			}
		}
		
		for (String removedUid : removedUids) {
			SubscribedEvent removeEvent = subscribedEventDAO.findByCalendarAndUid(subscribedCalendar, removedUid);
			if (removeEvent != null) {
			  subscribedEventDAO.delete(removeEvent);
			}
		}
		
		subscribedCalendarDAO.updateLastSynchronized(subscribedCalendar, new Date(System.currentTimeMillis()));
	}
	
	public void synchronizeSubscribedCalendar(SubscribedCalendar subscribedCalendar) throws IOException, ParserException, URISyntaxException {
		synchronizeSubscribedCalendar(subscribedCalendar, loadIcsCalendar(subscribedCalendar.getUrl()));
	}

	public SubscribedCalendar getNextSubscribedCalendarToBeSynchronized() {
		List<SubscribedCalendar> calendars = subscribedCalendarDAO.listAllOrderByLastSynchronizedAsc(0, 1);

		if (calendars.size() == 1) {
  		return calendars.get(0);
		}
		
		return null;
	}
	
	/* UserCalendar */

	public UserCalendar findUserCalendarByCalendarAndUser(Calendar calendar, UserEntity user) {
		return userCalendarDAO.findByCalendarAndUser(calendar, user.getId());
	}

	public UserCalendar updateUserCalendarVisible(UserCalendar userCalendar, Boolean visible) {
		return userCalendarDAO.updateVisible(userCalendar, visible);
	}
	
	/* LocalEvents */

	public LocalEvent createLocalEvent(LocalCalendar calendar, LocalEventType type, String summary, String description, String location, String url, Date start, Date end, Boolean allDay, BigDecimal latitude, BigDecimal longitude, String hangoutUrl) {
		return localEventDAO.create(calendar, type, summary, description, location, url, start, end, allDay, latitude, longitude, hangoutUrl);
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

	public LocalEvent updateLocalEventCalendar(LocalEvent localEvent, LocalCalendar localCalendar) {
		return localEventDAO.updateCalendar(localEvent, localCalendar);
	}
	
	/* Events */
	
	public List<Event> listCalendarEvents(Calendar calendar) {
		return eventDAO.listByCalendar(calendar);
	}
	
	public List<Event> listCalendarEvents(Calendar calendar, Date start, Date end) {
		// time span end <= event start, time span start => event end
		return eventDAO.listByCalendarAndStartLeAndEndGe(calendar, end, start);
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
	
	private Boolean getBooleanIcsComponentProperty(Component component, String propertyName) {
		Property property = component.getProperty(propertyName);
		if (property != null) {
			return "1".equals(property.getValue());
		}
		
		return null;
	}
}
