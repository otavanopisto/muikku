package fi.muikku.plugins.calendar.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.calendar.model.CalendarCategory;
import fi.muikku.plugins.calendar.model.LocalCalendar;
import fi.muikku.plugins.calendar.model.LocalCalendar_;

@DAO
public class LocalCalendarDAO extends PluginDAO<LocalCalendar> {
	
	private static final long serialVersionUID = 4403330626269058560L;

	public LocalCalendar create(Long environmentId, CalendarCategory calendarCategory, String name, String color) {
    LocalCalendar localCalendar = new LocalCalendar();
    
    localCalendar.setName(name);
    localCalendar.setEnvironmentId(environmentId);
    localCalendar.setCalendarCategory(calendarCategory);
    localCalendar.setColor(color);
    
    getEntityManager().persist(localCalendar);
    
    return localCalendar;
  }
  
  public List<LocalCalendar> listByEnvironmentId(Long environmentId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LocalCalendar> criteria = criteriaBuilder.createQuery(LocalCalendar.class);
    Root<LocalCalendar> root = criteria.from(LocalCalendar.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(LocalCalendar_.environmentId), environmentId)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

  public LocalCalendar findByEnvironmentIdAndCategory(Long environmentId, CalendarCategory calendarCategory) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LocalCalendar> criteria = criteriaBuilder.createQuery(LocalCalendar.class);
    Root<LocalCalendar> root = criteria.from(LocalCalendar.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(LocalCalendar_.environmentId), environmentId),
        criteriaBuilder.equal(root.get(LocalCalendar_.calendarCategory), calendarCategory)
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
  }
}