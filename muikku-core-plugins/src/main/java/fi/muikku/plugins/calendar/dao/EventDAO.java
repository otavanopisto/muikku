package fi.muikku.plugins.calendar.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.calendar.model.Calendar;
import fi.muikku.plugins.calendar.model.Event;
import fi.muikku.plugins.calendar.model.Event_;


public class EventDAO extends CorePluginsDAO<Event> {

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
	
	public List<Event> listByCalendarAndStartLeAndEndGe(Calendar calendar, Date start, Date end) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Event> criteria = criteriaBuilder.createQuery(Event.class);
    Root<Event> root = criteria.from(Event.class);
    criteria.select(root);
    
    criteria.where(
    	criteriaBuilder.and(
        criteriaBuilder.greaterThanOrEqualTo(root.get(Event_.end), end),
        criteriaBuilder.lessThanOrEqualTo(root.get(Event_.start), start),
        criteriaBuilder.equal(root.get(Event_.calendar), calendar)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
	}

}
