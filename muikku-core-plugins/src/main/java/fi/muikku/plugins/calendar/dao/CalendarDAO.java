package fi.muikku.plugins.calendar.dao;

import fi.muikku.dao.DAO;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.calendar.model.Calendar;

@DAO
public class CalendarDAO extends CorePluginsDAO<Calendar> {

	private static final long serialVersionUID = -1305486704450948743L;

	public Calendar updateName(Calendar calendar, String name) {
		calendar.setName(name);
		getEntityManager().persist(calendar);
		return calendar;
	}

	public Calendar updateColor(Calendar calendar, String color) {
		calendar.setColor(color);
		getEntityManager().persist(calendar);
		return calendar;
	}

}