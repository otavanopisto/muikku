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

	public LocalEvent create(LocalCalendar calendar, LocalEventType type, String summary, String description, String location, String url, Date startTime, Date endTime, Boolean allDayEvent, BigDecimal latitude, BigDecimal longitude) {
		LocalEvent event = new LocalEvent();
    event.setCalendar(calendar);
    event.setSummary(summary);
    event.setAllDayEvent(allDayEvent);
    event.setDescription(description);
    event.setEndTime(endTime);
    event.setStartTime(startTime);
    event.setUrl(url);
    event.setLocation(location);
    event.setType(type);
    event.setLatitude(latitude);
    event.setLongitude(longitude);
    
    getEntityManager().persist(event);
    
    return event;
  }
  
}
