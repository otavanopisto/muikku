package fi.muikku.plugins.calendar.dao;


import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.calendar.model.LocalCalendar;


public class LocalCalendarDAO extends CorePluginsDAO<LocalCalendar> {
	
	private static final long serialVersionUID = 4403330626269058560L;

	public LocalCalendar create(String name, String color) {
    LocalCalendar localCalendar = new LocalCalendar();
    
    localCalendar.setName(name);
    localCalendar.setColor(color);
    
    getEntityManager().persist(localCalendar);
    
    return localCalendar;
  }

}