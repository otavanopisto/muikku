package fi.muikku.plugins.calendar;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;

import fi.muikku.calendar.Calendar;
import fi.muikku.calendar.CalendarServiceException;
import fi.muikku.calendar.CalendarServiceProvider;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.calendar.dao.UserCalendarDAO;
import fi.muikku.plugins.calendar.model.UserCalendar;

@Dependent
@Stateless
public class CalendarController {

  @Inject
  @Any
  private Instance<CalendarServiceProvider> serviceProviders;

  @Inject
  private UserCalendarDAO userCalendarDAO;
  
  public UserCalendar createCalendar(UserEntity user, String serviceProvider, String summary, String description, Boolean visible) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(serviceProvider);
    if (provider != null) {
      Calendar calendar = provider.createCalendar(summary, description);
      if (calendar == null) {
        throw new CalendarServiceException("Could create calendar for service provider: " + serviceProvider);
      } else {
        return userCalendarDAO.create(calendar.getId(), serviceProvider, user.getId(), visible);
      }
    } else {
      throw new CalendarServiceException("Could not find calendar service provider: " + serviceProvider);
    }
  }

  public UserCalendar findUserCalendar(Long id) {
    return userCalendarDAO.findById(id);
  }
  
  public List<UserCalendar> listUserCalendars(UserEntity user) {
    return userCalendarDAO.listByUserId(user.getId());
  }

  public UserCalendar updateCalendar(UserCalendar userCalendar, String subject, String description) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());
    
    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar calendar for user calendar #" + userCalendar.getId());
    }
    
    // TODO: Implement actual updating
    
    return userCalendar;
  }
  
  public void deleteCalendar(UserCalendar userCalendar) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());
    
    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar calendar for user calendar #" + userCalendar.getId());
    }
    
    // TODO: Implement actual deleting
  }
  
  public Calendar loadCalendar(UserCalendar userCalendar) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());
    if (provider != null) {
      Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
      return calendar;
    } else {
      throw new CalendarServiceException("Could not find calendar service provider: " + userCalendar.getCalendarProvider());
    }
  }

  private CalendarServiceProvider getCalendarServiceProvider(String name) {
    Iterator<CalendarServiceProvider> iterator = serviceProviders.iterator();
    while (iterator.hasNext()) {
      CalendarServiceProvider serviceProvider = iterator.next();
      if (name.equals(serviceProvider.getName())) {
        return serviceProvider;
      }
    }

    return null;
  }

  @SuppressWarnings("unused")
  private List<CalendarServiceProvider> getCalendarServiceProviders() {
    List<CalendarServiceProvider> result = new ArrayList<>();
    CollectionUtils.addAll(result, serviceProviders.iterator());
    return Collections.unmodifiableList(result);
  }
//  @Inject
//  private Logger logger;
//
//	@Inject
//	private CalendarDAO calendarDAO;
//
//	@Inject
//	private EventDAO eventDAO;
//
//	@Inject
//	private UserCalendarDAO userCalendarDAO;
//
//	@Inject
//	private LocalCalendarDAO localCalendarDAO;
//
//	@Inject
//	private LocalEventDAO localEventDAO;
//
//	@Inject
//	private LocalEventTypeDAO localEventTypeDAO;
//
//	@Inject
//	private SubscribedCalendarDAO subscribedCalendarDAO;
//
//	@Inject
//	private SubscribedEventDAO subscribedEventDAO;
//
//	/* UserCalendar */
//
//	public List<UserCalendar> listUserCalendars(UserEntity user) {
//		return userCalendarDAO.listByUserId(user.getId());
//	}
//
//	/* Calendar */
//
//	public Calendar findCalendar(Long calendarId) {
//		return calendarDAO.findById(calendarId);
//	}
//
//	public List<Calendar> listCalendars(UserEntity user) {
//		List<Calendar> result = new ArrayList<>();
//		List<UserCalendar> userCalendars = userCalendarDAO.listByUserId(user.getId());
//		for (UserCalendar userCalendar : userCalendars) {
//			result.add(userCalendar.getCalendar());
//		}
//		return result;
//	}
//
//	public Calendar updateCalendarName(Calendar calendar, String name) {
//		return calendarDAO.updateName(calendar, name);
//	}
//
//	/* LocalCalendar */
//
//	public UserCalendar createLocalUserCalendar(UserEntity user, String name, String color, Boolean visible) {
//		LocalCalendar localCalendar = localCalendarDAO.create(name, color);
//		UserCalendar userCalendar = userCalendarDAO.create(localCalendar, user.getId(), visible);
//		return userCalendar;
//	}
//
//	public List<LocalCalendar> listUserLocalCalendars(UserEntity user) {
//		List<LocalCalendar> result = new ArrayList<>();
//		List<UserCalendar> userCalendars = listUserCalendars(user);
//		for (UserCalendar userCalendar : userCalendars) {
//		  if (userCalendar.getCalendar() instanceof LocalCalendar) {
//		  	result.add((LocalCalendar) userCalendar.getCalendar());
//		  }
//		}
//
//		return result;
//	}
//
//	public List<UserCalendar> listUserLocalUserCalendars(UserEntity user) {
//		List<UserCalendar> result = new ArrayList<>();
//		List<UserCalendar> userCalendars = listUserCalendars(user);
//		for (UserCalendar userCalendar : userCalendars) {
//		  if (userCalendar.getCalendar() instanceof LocalCalendar) {
//		  	result.add(userCalendar);
//		  }
//		}
//
//		return result;
//	}
//
//	/* SubscribedCalendar */
//
//	public UserCalendar createSubscribedUserCalendar(UserEntity user, String name, String url, String color, Boolean visible, Date lastSynchronized) {
//		SubscribedCalendar subscribedCalendar = subscribedCalendarDAO.create(name, url, color, lastSynchronized);
//		UserCalendar userCalendar = userCalendarDAO.create(subscribedCalendar, user.getId(), visible);
//		return userCalendar;
//	}
//
//	public UserCalendar findSubscribedUserCalendar(UserEntity userEntity, String url) {
//		List<UserCalendar> userCalendars = userCalendarDAO.listByUserId(userEntity.getId());
//		for (UserCalendar userCalendar : userCalendars) {
//			if (userCalendar.getCalendar() instanceof SubscribedCalendar) {
//				SubscribedCalendar subscribedCalendar = (SubscribedCalendar) userCalendar.getCalendar();
//				if (subscribedCalendar.getUrl().equals(url))
//					return userCalendar;
//			}
//		}
//
//		return null;
//	}
//
//	public List<UserCalendar> listUserSubscribedUserCalendars(UserEntity user) {
//		List<UserCalendar> result = new ArrayList<>();
//		List<UserCalendar> userCalendars = listUserCalendars(user);
//		for (UserCalendar userCalendar : userCalendars) {
//		  if (userCalendar.getCalendar() instanceof SubscribedCalendar) {
//		  	result.add(userCalendar);
//		  }
//		}
//
//		return result;
//	}
//
//	public List<SubscribedCalendar> listUserSubscribedCalendars(UserEntity user) {
//		List<SubscribedCalendar> result = new ArrayList<>();
//
//		List<UserCalendar> userCalendars = listUserCalendars(user);
//		for (UserCalendar userCalendar : userCalendars) {
//		  if (userCalendar.getCalendar() instanceof SubscribedCalendar) {
//		  	result.add((SubscribedCalendar) userCalendar.getCalendar());
//		  }
//		}
//
//		return result;
//	}
//
//	public net.fortuna.ical4j.model.Calendar loadIcsCalendar(String url) throws IOException, ParserException, URISyntaxException {
//	  throw new IOException();
////		DefaultHttpClient httpClient = new DefaultHttpClient();
////
////		SchemeRegistry schemeRegistry = httpClient.getConnectionManager().getSchemeRegistry();
////		if (!schemeRegistry.getSchemeNames().contains("webcal")) {
////		  schemeRegistry.register(new Scheme("webcal", 80, PlainSocketFactory.getSocketFactory()));
////		}
////
////		HttpGet httpGet = new HttpGet(new URI(url));
////
////		HttpResponse response = httpClient.execute(httpGet);
////		if (response.getStatusLine().getStatusCode() == 200) {
////		  HttpEntity entity = response.getEntity();
////		  try {
////		  	InputStream content = entity.getContent();
////		  	try {
////			  	CalendarBuilder builder = new CalendarBuilder();
////  	  	  return builder.build(content);
////		  	} finally {
////		  		content.close();
////		  	}
////		  } finally {
////		  	EntityUtils.consume(entity);
////		  }
////		} else {
////			throw new IOException(response.getStatusLine().getReasonPhrase());
////		}
//	}
//
//	public String getIcsCalendarName(net.fortuna.ical4j.model.Calendar calendar) {
//		Property property = calendar.getProperty("X-WR-CALNAME");
//		if (property != null && StringUtils.isNotBlank(property.getValue())) {
//			// Check for X-WR-CALNAME extension
//			return property.getValue();
//		}
//
//		// If name could not be found from extension calendar does not contain name information
//		return null;
//	}
//
//	public boolean isAllDayIcsEvent(VEvent event) {
//		// Scan X-FUNAMBOL-ALLDAY and X-MICROSOFT-CDO-ALLDAYEVENT extensions for all-day info
//
//		Boolean extensionAllDay = getBooleanIcsComponentProperty(event, "X-FUNAMBOL-ALLDAY");
//		if (extensionAllDay != null) {
//			return extensionAllDay;
//		}
//
//		extensionAllDay = getBooleanIcsComponentProperty(event, "X-MICROSOFT-CDO-ALLDAYEVENT");
//		if (extensionAllDay != null) {
//			return extensionAllDay;
//		}
//
//		// If extensions are not defined we try to figure it out from the start and end dates
//		if (event.getEndDate() == null) {
//			return true;
//		}
//
//		long millisecondsBetween = event.getEndDate().getDate().getTime() - event.getStartDate().getDate().getTime();
//		if (millisecondsBetween < DateUtils.MILLIS_PER_DAY) {
//			return false;
//		} else {
//			return true;
//		}
//
//	}
//
//	/**
//	 * Checks for Google's X-GOOGLE-HANGOUT extension
//	 *
//	 * @return Hangout url or null if not present
//	 */
//	private String getHangoutUrl(VEvent event) {
//		Property property = event.getProperty("X-GOOGLE-HANGOUT");
//		if (property != null) {
//			String url = property.getValue();
//			if (StringUtils.isNotBlank(url)) {
//				return url;
//			}
//		}
//
//		return null;
//	}
//
//	@SuppressWarnings("unchecked")
//  public void synchronizeSubscribedCalendar(SubscribedCalendar subscribedCalendar, net.fortuna.ical4j.model.Calendar icsCalendar) throws IOException, ParserException, URISyntaxException {
//		Set<String> removedUids = new HashSet<>();
//
//		List<SubscribedEvent> existingEvents = subscribedEventDAO.listByCalendar(subscribedCalendar);
//		for (SubscribedEvent existingEvent : existingEvents) {
//			removedUids.add(existingEvent.getUid());
//		}
//
//		Iterator<Component> componentIterator = icsCalendar.getComponents().iterator();
//		while (componentIterator.hasNext()) {
//			Component component = componentIterator.next();
//			if (component instanceof VEvent) {
//				VEvent event = (VEvent) component;
//
//				Uid uidObject = event.getUid();
//				if (uidObject != null) {
//  				Description descriptionObject = event.getDescription();
//  				Summary summaryObject = event.getSummary();
//  				DtStart startDate = event.getStartDate();
//  				DtEnd endDate = event.getEndDate();
//  				Url eventUrlObject = event.getUrl();
//  				Location locationObject = event.getLocation();
//  				Geo geographicPosObject = event.getGeographicPos();
//  				String uid = uidObject.getValue();
//
//  				if (startDate == null) {
//  					logger.warning("Subscribed event " + uid + " does not have a start date. Skipping");
//  					continue;
//  				}
//
//  				Date start = startDate.getDate();
//  				Date end = endDate == null ? start : endDate.getDate();
//  				boolean allDay = isAllDayIcsEvent(event);
//  				String summary = summaryObject != null ? summaryObject.getValue() : null;
//  				String description = descriptionObject != null ? descriptionObject.getValue() : null;
//  				String location = locationObject != null ? locationObject.getValue() : null;
//  				String eventUrl = eventUrlObject != null ? eventUrlObject.getValue() : null;
//  				BigDecimal latitude = geographicPosObject != null ? geographicPosObject.getLatitude() : null;
//  				BigDecimal longitude = geographicPosObject != null ? geographicPosObject.getLongitude(): null;
//  				String hangoutUrl = getHangoutUrl(event);
//
//  				SubscribedEvent subscribedEvent = subscribedEventDAO.findByCalendarAndUid(subscribedCalendar, uid);
//  				if (subscribedEvent == null) {
//    				subscribedEventDAO.create(subscribedCalendar, uid, summary, description, location, start, end, eventUrl, allDay, latitude, longitude, hangoutUrl);
//  				} else {
//  					subscribedEventDAO.updateSummary(subscribedEvent, summary);
//  					subscribedEventDAO.updateDescription(subscribedEvent, description);
//  					subscribedEventDAO.updateLocation(subscribedEvent, location);
//  					subscribedEventDAO.updateStart(subscribedEvent, start);
//  					subscribedEventDAO.updateEnd(subscribedEvent, end);
//  					subscribedEventDAO.updateUrl(subscribedEvent, eventUrl);
//  					subscribedEventDAO.updateAllDay(subscribedEvent, allDay);
//  					subscribedEventDAO.updateLatitude(subscribedEvent, latitude);
//  					subscribedEventDAO.updateLongitude(subscribedEvent, longitude);
//  					subscribedEventDAO.updateHangoutUrl(subscribedEvent, hangoutUrl);
//  				}
//
//  				removedUids.remove(uid);
//				} else {
//					logger.warning("Skiped " + subscribedCalendar.getId() + " event because no uid could be found.");
//				}
//			}
//		}
//
//		for (String removedUid : removedUids) {
//			SubscribedEvent removeEvent = subscribedEventDAO.findByCalendarAndUid(subscribedCalendar, removedUid);
//			if (removeEvent != null) {
//			  subscribedEventDAO.delete(removeEvent);
//			}
//		}
//
//		subscribedCalendarDAO.updateLastSynchronized(subscribedCalendar, new Date(System.currentTimeMillis()));
//	}
//
//	public void synchronizeSubscribedCalendar(SubscribedCalendar subscribedCalendar) throws IOException, ParserException, URISyntaxException {
//		synchronizeSubscribedCalendar(subscribedCalendar, loadIcsCalendar(subscribedCalendar.getUrl()));
//	}
//
//	public SubscribedCalendar getNextSubscribedCalendarToBeSynchronized() {
//		List<SubscribedCalendar> calendars = subscribedCalendarDAO.listAllOrderByLastSynchronizedAsc(0, 1);
//
//		if (calendars.size() == 1) {
//  		return calendars.get(0);
//		}
//
//		return null;
//	}
//
//	/* UserCalendar */
//
//	public UserCalendar findUserCalendarByCalendarAndUser(Calendar calendar, UserEntity user) {
//		return userCalendarDAO.findByCalendarAndUser(calendar, user.getId());
//	}
//
//	public UserCalendar updateUserCalendarVisible(UserCalendar userCalendar, Boolean visible) {
//		return userCalendarDAO.updateVisible(userCalendar, visible);
//	}
//
//	/* LocalEvents */
//
//	public LocalEvent createLocalEvent(LocalCalendar calendar, LocalEventType type, String summary, String description, String location, String url, Date start, Date end, Boolean allDay, BigDecimal latitude, BigDecimal longitude, String hangoutUrl) {
//		return localEventDAO.create(calendar, type, summary, description, location, url, start, end, allDay, latitude, longitude, hangoutUrl);
//	}
//
//	public LocalEvent findLocalEventById(Long id) {
//		return localEventDAO.findById(id);
//	}
//
//	public LocalEvent updateLocalEvent(LocalEvent localEvent, LocalEventType type, String summary, String description, String location, String url, Date start, Date end, Boolean allDay, BigDecimal latitude, BigDecimal longitude) {
//
//		localEventDAO.updateType(localEvent, type);
//		localEventDAO.updateSummary(localEvent, summary);
//		localEventDAO.updateDescription(localEvent, description);
//		localEventDAO.updateLocation(localEvent, location);
//		localEventDAO.updateUrl(localEvent, url);
//		localEventDAO.updateStart(localEvent, start);
//		localEventDAO.updateEnd(localEvent, end);
//		localEventDAO.updateAllDay(localEvent, allDay);
//		localEventDAO.updateLatitude(localEvent, latitude);
//		localEventDAO.updateLongitude(localEvent, longitude);
//
//		return localEvent;
//	}
//
//	public LocalEvent updateLocalEventCalendar(LocalEvent localEvent, LocalCalendar localCalendar) {
//		return localEventDAO.updateCalendar(localEvent, localCalendar);
//	}
//
//	public void deleteLocalEvent(LocalEvent localEvent) {
//		localEventDAO.delete(localEvent);
//	}
//
//	/* Events */
//
//	public List<Event> listCalendarEvents(Calendar calendar) {
//		return eventDAO.listByCalendar(calendar);
//	}
//
//	public List<Event> listCalendarEvents(Calendar calendar, Date start, Date end) {
//		// time span end <= event start, time span start => event end
//		return eventDAO.listByCalendarAndStartLeAndEndGe(calendar, end, start);
//	}
//
//	/* LocalEventType */
//
//	public LocalEventType createLocalEventType(String name) {
//		return localEventTypeDAO.create(name);
//	}
//
//	public LocalEventType findLocalEventType(Long id) {
//		return localEventTypeDAO.findById(id);
//	}
//
//	public List<LocalEventType> listLocalEventTypes() {
//		return localEventTypeDAO.listAll();
//	}
//
//	/* Private */
//
//	private Boolean getBooleanIcsComponentProperty(Component component, String propertyName) {
//		Property property = component.getProperty(propertyName);
//		if (property != null) {
//			return "1".equals(property.getValue());
//		}
//
//		return null;
//	}


}
