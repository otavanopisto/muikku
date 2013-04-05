package fi.muikku.plugins.calendar.dao;

import java.math.BigDecimal;
import java.util.Date;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.calendar.model.LocalCalendar;
import fi.muikku.plugins.calendar.model.LocalEvent;
import fi.muikku.plugins.calendar.model.LocalEventType;

@DAO
public class LocalEventDAO extends PluginDAO<LocalEvent> {

	private static final long serialVersionUID = -1572299088200049688L;

	public LocalEvent create(LocalCalendar calendar, LocalEventType type, String summary, String description, String location, String url, Date start, Date end, Boolean allDay, BigDecimal latitude, BigDecimal longitude) {
		LocalEvent event = new LocalEvent();
    event.setCalendar(calendar);
    event.setSummary(summary);
    event.setAllDay(allDay);
    event.setDescription(description);
    event.setEnd(end);
    event.setStart(start);
    event.setUrl(url);
    event.setLocation(location);
    event.setType(type);
    event.setLatitude(latitude);
    event.setLongitude(longitude);
    
    getEntityManager().persist(event);
    
    return event;
  }

	public LocalEvent updateType(LocalEvent localEvent, LocalEventType type) {
		localEvent.setType(type);
		getEntityManager().persist(localEvent);
		return localEvent;
	}
	
	public LocalEvent updateSummary(LocalEvent localEvent, String summary) {
		localEvent.setSummary(summary);
		getEntityManager().persist(localEvent);
		return localEvent;
	}
	
	public LocalEvent updateDescription(LocalEvent localEvent, String description) {
		localEvent.setDescription(description);
		getEntityManager().persist(localEvent);
		return localEvent;
	}
	
	public LocalEvent updateLocation(LocalEvent localEvent, String location) {
		localEvent.setLocation(location);
		getEntityManager().persist(localEvent);
		return localEvent;
	}
	
	public LocalEvent updateUrl(LocalEvent localEvent, String url) {
		localEvent.setUrl(url);
		getEntityManager().persist(localEvent);
		return localEvent;
	}
	
	public LocalEvent updateStart(LocalEvent localEvent, Date start) {
		localEvent.setStart(start);
		getEntityManager().persist(localEvent);
		return localEvent;
	}
	
	public LocalEvent updateEnd(LocalEvent localEvent, Date end) {
		localEvent.setEnd(end);
		getEntityManager().persist(localEvent);
		return localEvent;
	}
	
	public LocalEvent updateAllDay(LocalEvent localEvent, Boolean allDay) {
		localEvent.setAllDay(allDay);
		getEntityManager().persist(localEvent);
		return localEvent;
	}
	
	public LocalEvent updateLatitude(LocalEvent localEvent, BigDecimal latitude) {
		localEvent.setLatitude(latitude);
		getEntityManager().persist(localEvent);
		return localEvent;
	}
	
	public LocalEvent updateLongitude(LocalEvent localEvent, BigDecimal longitude) {
		localEvent.setLongitude(longitude);
		getEntityManager().persist(localEvent);
		return localEvent;
	}
	
}