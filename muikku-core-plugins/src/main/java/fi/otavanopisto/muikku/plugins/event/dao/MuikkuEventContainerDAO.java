package fi.otavanopisto.muikku.plugins.event.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEvent;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventContainer;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventContainer_;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventParticipant;
import fi.otavanopisto.muikku.plugins.event.model.MuikkuEventParticipant_;

public class MuikkuEventContainerDAO extends CorePluginsDAO<MuikkuEventContainer> {
  
  private static final long serialVersionUID = 4504898469280361641L;

  public MuikkuEventContainer create(Long workspaceEntityId, Long userEntityId, String type, String name) {
    MuikkuEventContainer eventContainer = new MuikkuEventContainer();
    eventContainer.setWorkspaceEntityId(workspaceEntityId);
    eventContainer.setUserEntityId(userEntityId);
    eventContainer.setType(type);
    eventContainer.setName(name);
    return persist(eventContainer);
  }

  public MuikkuEventContainer update(MuikkuEventContainer eventContainer, Long workspaceEntityId, Long userEntityId, String type, String name) {
    eventContainer.setWorkspaceEntityId(workspaceEntityId);
    eventContainer.setUserEntityId(userEntityId);
    eventContainer.setType(type);
    eventContainer.setName(name);
    return persist(eventContainer);
  }
  
  public MuikkuEventContainer findByUser(Long userEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<MuikkuEventContainer> criteria = criteriaBuilder.createQuery(MuikkuEventContainer.class);
    Root<MuikkuEventContainer> root = criteria.from(MuikkuEventContainer.class);
    
    criteria.select(root);
    criteria.where(
            criteriaBuilder.equal(root.get(MuikkuEventContainer_.userEntityId), userEntityId)
        
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  @Override
  public void delete(MuikkuEventContainer eventContainer) {
    super.delete(eventContainer);
  }

}
