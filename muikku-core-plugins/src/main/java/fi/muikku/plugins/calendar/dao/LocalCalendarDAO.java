package fi.muikku.plugins.calendar.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.calendar.model.LocalCalendar;

@DAO
public class LocalCalendarDAO extends PluginDAO<LocalCalendar> {
	
	private static final long serialVersionUID = 4403330626269058560L;

	public LocalCalendar create(String name, String color) {
    LocalCalendar localCalendar = new LocalCalendar();
    
    localCalendar.setName(name);
    localCalendar.setColor(color);
    
    getEntityManager().persist(localCalendar);
    
    return localCalendar;
  }

}