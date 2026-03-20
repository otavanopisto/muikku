package fi.otavanopisto.muikku.plugins.event.dao;

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
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEvent;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventParticipant;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventParticipant_;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEvent_;
import fi.otavanopisto.muikku.plugins.event.model.EventType;

public class MuikkuEventDAO extends CorePluginsDAO<MuikkuEvent> {

  private static final long serialVersionUID = 3875209908218154783L;

  public MuikkuEvent create(Date start, Date end, boolean allDay, String title, String description, EventType type, Long userEntityId, Long creatorEntityId, boolean editableByUser, boolean isPrivate, boolean removableByUser, Long eventContainerId) {
    MuikkuEvent event = new MuikkuEvent();
    event.setStart(start);
    event.setEnd(end);
    event.setAllDay(allDay);
    event.setTitle(title);
    event.setDescription(description);
    event.setType(type);
    event.setUserEntityId(userEntityId);
    event.setCreatorEntityId(creatorEntityId);
    event.setEditableByUser(editableByUser);
    event.setPrivate(isPrivate);
    event.setRemovableByUser(removableByUser);
    event.setEventContainerId(eventContainerId);
    return persist(event);
  }

  public MuikkuEvent update(MuikkuEvent event, Date start, Date end, boolean allDay, String title, String description, EventType type, boolean editableByUser, boolean isPrivate, boolean removableByUser) {
    event.setStart(start);
    event.setEnd(end);
    event.setAllDay(allDay);
    event.setTitle(title);
    event.setDescription(description);
    event.setType(type);
    event.setEditableByUser(editableByUser);
    event.setPrivate(isPrivate);
    event.setRemovableByUser(removableByUser);
    return persist(event);
  }
  
  @Override
  public void delete(MuikkuEvent event) {
    super.delete(event);
  }

  public List<MuikkuEvent> listByUserAndTimeframeAndType(Long userEntityId, Date start, Date end, String type) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<MuikkuEvent> criteria = criteriaBuilder.createQuery(MuikkuEvent.class);
    Root<MuikkuEvent> root = criteria.from(MuikkuEvent.class);

    Subquery<MuikkuEvent> subquery = criteria.subquery(MuikkuEvent.class);
    Root<MuikkuEventParticipant> participantRoot = subquery.from(MuikkuEventParticipant.class);    
    subquery.select(participantRoot.get(MuikkuEventParticipant_.muikkuEvent));
    subquery.where(
        criteriaBuilder.equal(participantRoot.get(MuikkuEventParticipant_.userEntityId), userEntityId)
    );
    
    List<Predicate> predicates = new ArrayList<>();
    
    // Timeframe
    
    Predicate predicate = criteriaBuilder.and(
        criteriaBuilder.greaterThanOrEqualTo(root.get(MuikkuEvent_.end), start),
        criteriaBuilder.lessThanOrEqualTo(root.get(MuikkuEvent_.start), end)
    );
    predicates.add(predicate);
    
    // Type (optional)
    
    if (!StringUtils.isEmpty(type)) {
      predicate = criteriaBuilder.equal(root.get(MuikkuEvent_.type), type);
      predicates.add(predicate);
    }
    
    // Event participation
    
    predicate = criteriaBuilder.or(
        // event belongs to user
        criteriaBuilder.equal(root.get(MuikkuEvent_.userEntityId), userEntityId),
        // user is event participant
        root.in(subquery)
    );
    predicates.add(predicate);
    
    criteria.select(root);
    criteria.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));
    return entityManager.createQuery(criteria).getResultList();
  }

}
