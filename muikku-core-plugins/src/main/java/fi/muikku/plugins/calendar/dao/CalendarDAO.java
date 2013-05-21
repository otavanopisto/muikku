package fi.muikku.plugins.calendar.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.calendar.model.Calendar;
import fi.muikku.plugins.calendar.model.CalendarCategory;

@DAO
public class CalendarDAO extends PluginDAO<Calendar> {

	private static final long serialVersionUID = -1305486704450948743L;

	public Calendar updateName(Calendar calendar, String name) {
		calendar.setName(name);
		getEntityManager().persist(calendar);
		return calendar;
	}

	public Calendar updateCategory(Calendar calendar, CalendarCategory calendarCategory) {
		calendar.setCalendarCategory(calendarCategory);
		getEntityManager().persist(calendar);
		return calendar;
	}
	
	public Calendar updateColor(Calendar calendar, String color) {
		calendar.setColor(color);
		getEntityManager().persist(calendar);
		return calendar;
	}

}