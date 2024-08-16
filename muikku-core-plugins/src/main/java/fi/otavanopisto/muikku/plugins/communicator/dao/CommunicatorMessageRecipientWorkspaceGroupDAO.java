package fi.otavanopisto.muikku.plugins.communicator.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipientWorkspaceGroup;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient_;


public class CommunicatorMessageRecipientWorkspaceGroupDAO extends CorePluginsDAO<CommunicatorMessageRecipientWorkspaceGroup> {
	
  private static final long serialVersionUID = 1450192242311134158L;

  public CommunicatorMessageRecipientWorkspaceGroup create(WorkspaceEntity workspaceEntity, WorkspaceRoleArchetype archetype) {
    CommunicatorMessageRecipientWorkspaceGroup workspaceGroup = new CommunicatorMessageRecipientWorkspaceGroup();
    
    workspaceGroup.setArchetype(archetype);
    workspaceGroup.setWorkspaceEntityId(workspaceEntity.getId());
    
    getEntityManager().persist(workspaceGroup);
    
    return workspaceGroup;
  }
 
  public List<CommunicatorMessageRecipientWorkspaceGroup> listByMessage(CommunicatorMessage communicatorMessage) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessageRecipientWorkspaceGroup> criteria = criteriaBuilder.createQuery(CommunicatorMessageRecipientWorkspaceGroup.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    
    /**
     * Treat is not ideal here but it seems to end up with cleanest query. Better would be if there
     * could be simpler and/or bidirectional relationship with CommunicatorMessageRecipient and
     * CommunicatorMessageRecipientWorkspaceGroup (or all of the group classes). Many other approaches
     * end up in a cross join or other complications.
     */
    
    criteria.select(criteriaBuilder.treat(root.get(CommunicatorMessageRecipient_.recipientGroup), CommunicatorMessageRecipientWorkspaceGroup.class)).distinct(true);
    criteria.where(
        criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.communicatorMessage), communicatorMessage)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<CommunicatorMessageRecipientWorkspaceGroup> listByMessageAndUser(CommunicatorMessage communicatorMessage, UserEntity userEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessageRecipientWorkspaceGroup> criteria = criteriaBuilder.createQuery(CommunicatorMessageRecipientWorkspaceGroup.class);
    Root<CommunicatorMessageRecipientWorkspaceGroup> root = criteria.from(CommunicatorMessageRecipientWorkspaceGroup.class);
    Root<CommunicatorMessageRecipient> root2 = criteria.from(CommunicatorMessageRecipient.class);
    
    criteria.select(root).distinct(true);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root2.get(CommunicatorMessageRecipient_.recipientGroup), root),
            criteriaBuilder.equal(root2.get(CommunicatorMessageRecipient_.communicatorMessage), communicatorMessage),
            criteriaBuilder.equal(root2.get(CommunicatorMessageRecipient_.recipient), userEntity.getId())
)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
