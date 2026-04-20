package fi.otavanopisto.muikku.plugins.event.dao;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.event.model.EventType;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEvent;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventContainer;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventContainer_;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEvent_;

public class MuikkuEventDAO extends CorePluginsDAO<MuikkuEvent> {

  private static final long serialVersionUID = 3875209908218154783L;

  public MuikkuEvent create(Date start, Date end, boolean allDay, String title, String description, EventType type, Long userEntityId, Long creatorEntityId, boolean editableByUser, boolean isPrivate, boolean removableByUser, MuikkuEventContainer eventContainer) {
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
    event.setEventContainer(eventContainer);
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

  public List<MuikkuEvent> listByUserAndWorkspaceAndTimeframeAndType(Long userEntityId, Long workspaceEntityId, Date start, Date end, EventType type) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<MuikkuEvent> criteria = criteriaBuilder.createQuery(MuikkuEvent.class);
    Root<MuikkuEvent> root = criteria.from(MuikkuEvent.class);
    
    List<Predicate> predicates = new ArrayList<>();
    
    // Timeframe
    
    Predicate predicate = criteriaBuilder.and(
        criteriaBuilder.greaterThanOrEqualTo(root.get(MuikkuEvent_.end), start),
        criteriaBuilder.lessThanOrEqualTo(root.get(MuikkuEvent_.start), end)
    );
    predicates.add(predicate);
    
    // Type (optional)
    
    if (type != null) {
      predicate = criteriaBuilder.equal(root.get(MuikkuEvent_.type), type);
      predicates.add(predicate);
    }
    
    // Users
    if (userEntityId != null) {
      predicates.add(
          criteriaBuilder.equal(root.get(MuikkuEvent_.userEntityId), userEntityId)
      );
    }

    // Workspaces
    
    if (workspaceEntityId != null) {

      Join<MuikkuEvent, MuikkuEventContainer> containerJoin =
          root.join(MuikkuEvent_.eventContainer);

      predicates.add(
          criteriaBuilder.equal(
              containerJoin.get(MuikkuEventContainer_.workspaceEntityId),
              workspaceEntityId
          )
      );
    }
    
    criteria.select(root);
    criteria.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<MuikkuEvent> listByReferenceEvent(MuikkuEvent event) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<MuikkuEvent> criteria = criteriaBuilder.createQuery(MuikkuEvent.class);
    Root<MuikkuEvent> root = criteria.from(MuikkuEvent.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(MuikkuEvent_.eventId), event)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

}
