package fi.otavanopisto.muikku.plugins.calendar.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEvent;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventParticipant;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventParticipant_;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventVisibility;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEvent_;

public class CalendarEventDAO extends CorePluginsDAO<CalendarEvent> {

  private static final long serialVersionUID = 3875209908218154783L;

  public CalendarEvent create(Date start, Date end, boolean allDay, String title, String description, CalendarEventVisibility visibility, String type, Long userEntityId) {
    CalendarEvent event = new CalendarEvent();
    event.setStart(start);
    event.setEnd(end);
    event.setAllDay(allDay);
    event.setTitle(title);
    event.setDescription(description);
    event.setVisibility(visibility);
    event.setType(type);
    event.setUserEntityId(userEntityId);
    return persist(event);
  }

  public CalendarEvent update(CalendarEvent event, Date start, Date end, boolean allDay, String title, String description, CalendarEventVisibility visibility, String type) {
    event.setStart(start);
    event.setEnd(end);
    event.setAllDay(allDay);
    event.setTitle(title);
    event.setDescription(description);
    event.setVisibility(visibility);
    event.setType(type);
    return persist(event);
  }
  
  @Override
  public void delete(CalendarEvent event) {
    super.delete(event);
  }

  public List<CalendarEvent> listByUserAndTimeframeAndType(Long userEntityId, Date start, Date end, String type) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CalendarEvent> criteria = criteriaBuilder.createQuery(CalendarEvent.class);
    Root<CalendarEvent> root = criteria.from(CalendarEvent.class);

    Subquery<CalendarEvent> subquery = criteria.subquery(CalendarEvent.class);
    Root<CalendarEventParticipant> participantRoot = subquery.from(CalendarEventParticipant.class);    
    subquery.select(participantRoot.get(CalendarEventParticipant_.event));
    subquery.where(
        criteriaBuilder.equal(participantRoot.get(CalendarEventParticipant_.userEntityId), userEntityId)
    );
    
    List<Predicate> predicates = new ArrayList<>();
    
    // Timeframe
    
    Predicate predicate = criteriaBuilder.and(
        criteriaBuilder.greaterThanOrEqualTo(root.get(CalendarEvent_.end), start),
        criteriaBuilder.lessThanOrEqualTo(root.get(CalendarEvent_.start), end)
    );
    predicates.add(predicate);
    
    // Type (optional)
    
    if (!StringUtils.isEmpty(type)) {
      predicate = criteriaBuilder.equal(root.get(CalendarEvent_.type), type);
      predicates.add(predicate);
    }
    
    // Event participation
    
    predicate = criteriaBuilder.or(
        // event belongs to user
        criteriaBuilder.equal(root.get(CalendarEvent_.userEntityId), userEntityId),
        // user is event participant
        root.in(subquery)
    );
    predicates.add(predicate);
    
    criteria.select(root);
    criteria.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));
    return entityManager.createQuery(criteria).getResultList();
  }

}
