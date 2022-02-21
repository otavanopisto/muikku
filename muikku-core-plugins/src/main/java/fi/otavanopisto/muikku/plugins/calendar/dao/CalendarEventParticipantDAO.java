package fi.otavanopisto.muikku.plugins.calendar.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEvent;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventAttendance;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventParticipant;
import fi.otavanopisto.muikku.plugins.calendar.model.CalendarEventParticipant_;

public class CalendarEventParticipantDAO extends CorePluginsDAO<CalendarEventParticipant> {

  private static final long serialVersionUID = -8002236795182875672L;
  
  public CalendarEventParticipant create(CalendarEvent event, Long userEntityId, CalendarEventAttendance attendance) {
    CalendarEventParticipant participant = new CalendarEventParticipant();
    participant.setEvent(event);
    participant.setUserEntityId(userEntityId);
    participant.setAttendance(attendance);
    return persist(participant);
  }
  
  public CalendarEventParticipant findByEventAndParticipant(CalendarEvent event, Long userEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CalendarEventParticipant> criteria = criteriaBuilder.createQuery(CalendarEventParticipant.class);
    Root<CalendarEventParticipant> root = criteria.from(CalendarEventParticipant.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CalendarEventParticipant_.event), event),
            criteriaBuilder.equal(root.get(CalendarEventParticipant_.userEntityId), userEntityId)
        )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<CalendarEventParticipant> listByEvent(CalendarEvent event) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CalendarEventParticipant> criteria = criteriaBuilder.createQuery(CalendarEventParticipant.class);
    Root<CalendarEventParticipant> root = criteria.from(CalendarEventParticipant.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(CalendarEventParticipant_.event), event)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public CalendarEventParticipant updateAttendance(CalendarEventParticipant participant, CalendarEventAttendance attendance) {
    participant.setAttendance(attendance);
    return persist(participant);
  }

  @Override
  public void delete(CalendarEventParticipant participant) {
    super.delete(participant);
  }
  
}
