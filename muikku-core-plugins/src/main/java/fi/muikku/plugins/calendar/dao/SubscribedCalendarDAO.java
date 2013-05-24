package fi.muikku.plugins.calendar.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.calendar.model.SubscribedCalendar;

@DAO
public class SubscribedCalendarDAO extends PluginDAO<SubscribedCalendar> {
	
	private static final long serialVersionUID = -4015334453127961131L;

	public SubscribedCalendar create(String name, String url, String color) {
    SubscribedCalendar subscribedCalendar = new SubscribedCalendar();
    subscribedCalendar.setName(name);
    subscribedCalendar.setUrl(url);
    subscribedCalendar.setColor(color);
    
    getEntityManager().persist(subscribedCalendar);
    
    return subscribedCalendar;
  }

}