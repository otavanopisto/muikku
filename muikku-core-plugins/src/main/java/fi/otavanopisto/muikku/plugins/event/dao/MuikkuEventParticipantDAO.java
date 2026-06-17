package fi.otavanopisto.muikku.plugins.event.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.event.EventAttendance;
import fi.otavanopisto.muikku.model.event.MuikkuEvent;
import fi.otavanopisto.muikku.model.event.MuikkuEventParticipant;
import fi.otavanopisto.muikku.model.event.MuikkuEventParticipant_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;

public class MuikkuEventParticipantDAO extends CorePluginsDAO<MuikkuEventParticipant> {

  private static final long serialVersionUID = -8002236795182875672L;
  
  public MuikkuEventParticipant create(MuikkuEvent event, Long userEntityId, EventAttendance attendance) {
    MuikkuEventParticipant participant = new MuikkuEventParticipant();
    participant.setEvent(event);
    participant.setUserEntityId(userEntityId);
    participant.setAttendance(attendance);
    return persist(participant);
  }
  
  public MuikkuEventParticipant findByEventAndParticipant(MuikkuEvent event, Long userEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<MuikkuEventParticipant> criteria = criteriaBuilder.createQuery(MuikkuEventParticipant.class);
    Root<MuikkuEventParticipant> root = criteria.from(MuikkuEventParticipant.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(MuikkuEventParticipant_.muikkuEvent), event),
            criteriaBuilder.equal(root.get(MuikkuEventParticipant_.userEntityId), userEntityId)
        )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<MuikkuEventParticipant> listByEvent(MuikkuEvent event) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<MuikkuEventParticipant> criteria = criteriaBuilder.createQuery(MuikkuEventParticipant.class);
    Root<MuikkuEventParticipant> root = criteria.from(MuikkuEventParticipant.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(MuikkuEventParticipant_.muikkuEvent), event)
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public MuikkuEventParticipant updateAttendance(MuikkuEventParticipant participant, EventAttendance attendance) {
    participant.setAttendance(attendance);
    return persist(participant);
  }

  @Override
  public void delete(MuikkuEventParticipant participant) {
    super.delete(participant);
  }
  
}
