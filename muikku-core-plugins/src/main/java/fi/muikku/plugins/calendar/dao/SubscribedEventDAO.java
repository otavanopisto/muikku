package fi.muikku.plugins.calendar.dao;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.calendar.model.SubscribedCalendar;
import fi.muikku.plugins.calendar.model.SubscribedEvent;
import fi.muikku.plugins.calendar.model.SubscribedEvent_;

@DAO
public class SubscribedEventDAO extends CorePluginsDAO<SubscribedEvent> {

	private static final long serialVersionUID = -1572299088200049688L;

	public SubscribedEvent create(SubscribedCalendar calendar, String uid, String summary, String description, String location, Date start, Date end, String url, Boolean allDay, BigDecimal latitude, BigDecimal longitude, String hangoutUrl) {
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
    event.setHangoutUrl(hangoutUrl);
    
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

	public SubscribedEvent updateSummary(SubscribedEvent subscribedEvent, String summary) {
		subscribedEvent.setSummary(summary);
		getEntityManager().persist(subscribedEvent);
		return subscribedEvent;
	}

	public SubscribedEvent updateDescription(SubscribedEvent subscribedEvent, String description) {
		subscribedEvent.setDescription(description);
		getEntityManager().persist(subscribedEvent);
		return subscribedEvent;
	}

	public SubscribedEvent updateLocation(SubscribedEvent subscribedEvent, String location) {
		subscribedEvent.setLocation(location);
		getEntityManager().persist(subscribedEvent);
		return subscribedEvent;
	}

	public SubscribedEvent updateStart(SubscribedEvent subscribedEvent, Date start) {
		subscribedEvent.setStart(start);
		getEntityManager().persist(subscribedEvent);
		return subscribedEvent;
	}

	public SubscribedEvent updateEnd(SubscribedEvent subscribedEvent, Date end) {
		subscribedEvent.setEnd(end);
		getEntityManager().persist(subscribedEvent);
		return subscribedEvent;
	}

	public SubscribedEvent updateUrl(SubscribedEvent subscribedEvent, String url) {
		subscribedEvent.setUrl(url);
		getEntityManager().persist(subscribedEvent);
		return subscribedEvent;
	}

	public SubscribedEvent updateAllDay(SubscribedEvent subscribedEvent, boolean allDay) {
		subscribedEvent.setAllDay(allDay);
		getEntityManager().persist(subscribedEvent);
		return subscribedEvent;
	}

	public SubscribedEvent updateLatitude(SubscribedEvent subscribedEvent, BigDecimal latitude) {
		subscribedEvent.setLatitude(latitude);
		getEntityManager().persist(subscribedEvent);
		return subscribedEvent;
	}

	public SubscribedEvent updateLongitude(SubscribedEvent subscribedEvent, BigDecimal longitude) {
		subscribedEvent.setLongitude(longitude);
		getEntityManager().persist(subscribedEvent);
		return subscribedEvent;
	}

	public SubscribedEvent updateHangoutUrl(SubscribedEvent subscribedEvent, String hangoutUrl) {
		subscribedEvent.setHangoutUrl(hangoutUrl);
		getEntityManager().persist(subscribedEvent);
		return subscribedEvent;
	}
	
	public void delete(SubscribedEvent subscribedEvent) {
		super.delete(subscribedEvent);
	}
  
}
