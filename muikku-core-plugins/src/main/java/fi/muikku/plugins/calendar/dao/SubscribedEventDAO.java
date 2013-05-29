package fi.muikku.plugins.calendar.dao;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.calendar.model.SubscribedCalendar;
import fi.muikku.plugins.calendar.model.SubscribedEvent;
import fi.muikku.plugins.calendar.model.SubscribedEvent_;

@DAO
public class SubscribedEventDAO extends PluginDAO<SubscribedEvent> {

	private static final long serialVersionUID = -1572299088200049688L;

	public SubscribedEvent create(SubscribedCalendar calendar, String uid, String summary, String description, String location, Date start, Date end, String url, Boolean allDay, BigDecimal latitude, BigDecimal longitude) {
		SubscribedEvent event = new SubscribedEvent();
    
		event.setUid(uid);
		event.setSummary(summary);
    event.setCalendar(calendar);
    event.setAllDay(allDay);
    event.setDescription(description);
    event.setEnd(end);
    event.setStart(start);
    event.setLocation(location);
    event.setUrl(url);
    event.setLatitude(latitude);
    event.setLongitude(longitude);
    
    getEntityManager().persist(event);
    
    return event;
  }

	public SubscribedEvent findByCalendarAndUid(SubscribedCalendar subscribedCalendar, String uid) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SubscribedEvent> criteria = criteriaBuilder.createQuery(SubscribedEvent.class);
    Root<SubscribedEvent> root = criteria.from(SubscribedEvent.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(SubscribedEvent_.calendar), subscribedCalendar),
        criteriaBuilder.equal(root.get(SubscribedEvent_.uid), uid)
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
	}

  public List<SubscribedEvent> listByCalendar(SubscribedCalendar calendar) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SubscribedEvent> criteria = criteriaBuilder.createQuery(SubscribedEvent.class);
    Root<SubscribedEvent> root = criteria.from(SubscribedEvent.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(SubscribedEvent_.calendar), calendar)
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<SubscribedEvent> listByCalendarStartGe(SubscribedCalendar calendar, Date start) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SubscribedEvent> criteria = criteriaBuilder.createQuery(SubscribedEvent.class);
    Root<SubscribedEvent> root = criteria.from(SubscribedEvent.class);
    criteria.select(root);
    
    criteria.where(
    	criteriaBuilder.and(
        criteriaBuilder.greaterThanOrEqualTo(root.get(SubscribedEvent_.start), start),
        criteriaBuilder.equal(root.get(SubscribedEvent_.calendar), calendar)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
	}
  
  public List<SubscribedEvent> listByCalendarEndLe(SubscribedCalendar calendar, Date end) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SubscribedEvent> criteria = criteriaBuilder.createQuery(SubscribedEvent.class);
    Root<SubscribedEvent> root = criteria.from(SubscribedEvent.class);
    criteria.select(root);
    
    criteria.where(
    	criteriaBuilder.and(
        criteriaBuilder.lessThanOrEqualTo(root.get(SubscribedEvent_.end), end),
        criteriaBuilder.equal(root.get(SubscribedEvent_.calendar), calendar)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
	}

	public List<SubscribedEvent> listByCalendarStartGeEndLe(SubscribedCalendar calendar, Date start, Date end) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SubscribedEvent> criteria = criteriaBuilder.createQuery(SubscribedEvent.class);
    Root<SubscribedEvent> root = criteria.from(SubscribedEvent.class);
    criteria.select(root);
    
    criteria.where(
    	criteriaBuilder.and(
        criteriaBuilder.greaterThanOrEqualTo(root.get(SubscribedEvent_.start), start),
        criteriaBuilder.lessThanOrEqualTo(root.get(SubscribedEvent_.end), end),
        criteriaBuilder.equal(root.get(SubscribedEvent_.calendar), calendar)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
	}
	
	public void delete(SubscribedEvent subscribedEvent) {
		delete(subscribedEvent);
	}
  
}
