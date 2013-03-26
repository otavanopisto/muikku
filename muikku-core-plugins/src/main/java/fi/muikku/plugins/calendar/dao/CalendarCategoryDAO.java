package fi.muikku.plugins.calendar.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.calendar.model.CalendarCategory;
import fi.muikku.plugins.calendar.model.CalendarCategory_;

@DAO
public class CalendarCategoryDAO extends PluginDAO<CalendarCategory> {

	private static final long serialVersionUID = -2623618639996390620L;

	public CalendarCategory create(String name) {
		
		EntityManager entityManager = getEntityManager();
		
		CalendarCategory calendarCategory = new CalendarCategory();
    calendarCategory.setName(name);
    
    entityManager.persist(calendarCategory);

    return calendarCategory;
  }
  
  public CalendarCategory findByName(String name) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CalendarCategory> criteria = criteriaBuilder.createQuery(CalendarCategory.class);
    Root<CalendarCategory> root = criteria.from(CalendarCategory.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(CalendarCategory_.name), name)
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
  }
}