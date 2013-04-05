package fi.muikku.plugins.calendar.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.calendar.model.Calendar;
import fi.muikku.plugins.calendar.model.Event;
import fi.muikku.plugins.calendar.model.Event_;

@DAO
public class EventDAO extends PluginDAO<Event> {

	private static final long serialVersionUID = -5666356972359027036L;

	public List<Event> listByCalendar(Calendar calendar) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Event> criteria = criteriaBuilder.createQuery(Event.class);
    Root<Event> root = criteria.from(Event.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(Event_.calendar), calendar)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<Event> listByCalendarStartTimeGe(Calendar calendar, Date startTime) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Event> criteria = criteriaBuilder.createQuery(Event.class);
    Root<Event> root = criteria.from(Event.class);
    criteria.select(root);
    
    criteria.where(
    	criteriaBuilder.and(
        criteriaBuilder.greaterThanOrEqualTo(root.get(Event_.start), startTime),
        criteriaBuilder.equal(root.get(Event_.calendar), calendar)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
	}
  
  public List<Event> listByCalendarEndTimeLe(Calendar calendar, Date endTime) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Event> criteria = criteriaBuilder.createQuery(Event.class);
    Root<Event> root = criteria.from(Event.class);
    criteria.select(root);
    
    criteria.where(
    	criteriaBuilder.and(
        criteriaBuilder.lessThanOrEqualTo(root.get(Event_.end), endTime),
        criteriaBuilder.equal(root.get(Event_.calendar), calendar)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
	}

	public List<Event> listByCalendarStartTimeGeEndTimeLe(Calendar calendar, Date startTime, Date endTime) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Event> criteria = criteriaBuilder.createQuery(Event.class);
    Root<Event> root = criteria.from(Event.class);
    criteria.select(root);
    
    criteria.where(
    	criteriaBuilder.and(
        criteriaBuilder.greaterThanOrEqualTo(root.get(Event_.start), startTime),
        criteriaBuilder.lessThanOrEqualTo(root.get(Event_.end), endTime),
        criteriaBuilder.equal(root.get(Event_.calendar), calendar)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
	}
  
}
