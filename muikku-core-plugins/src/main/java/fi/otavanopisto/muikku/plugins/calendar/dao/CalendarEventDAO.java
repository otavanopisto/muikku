package fi.otavanopisto.muikku.plugins.calendar.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEvent;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventParticipant;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventParticipant_;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventVisibility;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEvent_;

public class CalendarEventDAO extends CorePluginsDAO<CalendarEvent> {

  private static final long serialVersionUID = 3875209908218154783L;

  public CalendarEvent create(Date begins, Date ends, boolean allDay, String title, String description, CalendarEventVisibility visibility, Long userEntityId) {
    CalendarEvent event = new CalendarEvent();
    event.setBegins(begins);
    event.setEnds(ends);
    event.setAllDay(allDay);
    event.setTitle(title);
    event.setDescription(description);
    event.setVisibility(visibility);
    event.setUserEntityId(userEntityId);
    return persist(event);
  }

  public CalendarEvent update(CalendarEvent event, Date begins, Date ends, boolean allDay, String title, String description, CalendarEventVisibility visibility) {
    event.setBegins(begins);
    event.setEnds(ends);
    event.setAllDay(allDay);
    event.setTitle(title);
    event.setDescription(description);
    event.setVisibility(visibility);
    return persist(event);
  }
  
  @Override
  public void delete(CalendarEvent event) {
    super.delete(event);
  }

  public List<CalendarEvent> listByUserAndTimeframe(Long userEntityId, Date begins, Date ends) {
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
    
    criteria.select(root);
    criteria.where(
        // must match both timeframe and user
        criteriaBuilder.and(
            criteriaBuilder.or(
                // event within timeframe
                criteriaBuilder.and(
                    criteriaBuilder.greaterThanOrEqualTo(root.get(CalendarEvent_.begins), begins),
                    criteriaBuilder.lessThanOrEqualTo(root.get(CalendarEvent_.ends), ends)
                ),
                // event ends within timeframe
                criteriaBuilder.and(
                    criteriaBuilder.lessThanOrEqualTo(root.get(CalendarEvent_.begins), begins),
                    criteriaBuilder.lessThanOrEqualTo(root.get(CalendarEvent_.ends), ends),
                    criteriaBuilder.greaterThanOrEqualTo(root.get(CalendarEvent_.ends), begins)
                ),
                // event starts within timeframe
                criteriaBuilder.and(
                    criteriaBuilder.greaterThanOrEqualTo(root.get(CalendarEvent_.begins), begins),
                    criteriaBuilder.greaterThanOrEqualTo(root.get(CalendarEvent_.ends), ends),
                    criteriaBuilder.lessThanOrEqualTo(root.get(CalendarEvent_.begins), ends)
                )
            ),
            criteriaBuilder.or(
                // event belongs to user
                criteriaBuilder.equal(root.get(CalendarEvent_.userEntityId), userEntityId),
                // user is event participant
                root.in(subquery)
            )
        )
    );

    return entityManager.createQuery(criteria).getResultList();
  }

}
