package fi.muikku.plugins.calendar.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.calendar.model.CalendarCategory;
import fi.muikku.plugins.calendar.model.SubscribedCalendar;

@DAO
public class SubscribedCalendarDAO extends PluginDAO<SubscribedCalendar> {
	
	private static final long serialVersionUID = -4015334453127961131L;

	public SubscribedCalendar create(Long environmentId, CalendarCategory calendarCategory, String name, String url) {
    SubscribedCalendar subscribedCalendar = new SubscribedCalendar();
    subscribedCalendar.setName(name);
    subscribedCalendar.setEnvironmentId(environmentId);
    subscribedCalendar.setCalendarCategory(calendarCategory);
    subscribedCalendar.setUrl(url);
    
    getEntityManager().persist(subscribedCalendar);
    
    return subscribedCalendar;
  }

}