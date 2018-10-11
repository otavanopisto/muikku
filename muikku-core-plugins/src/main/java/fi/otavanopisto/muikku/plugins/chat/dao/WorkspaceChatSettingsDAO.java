package fi.otavanopisto.muikku.plugins.chat.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings_;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;
import fi.otavanopisto.muikku.plugins.forum.model.ForumMessage;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;


public class WorkspaceChatSettingsDAO extends CorePluginsDAO<WorkspaceChatSettings> {
	
  private static final long serialVersionUID = -7830619828801454118L;

  public WorkspaceChatSettings create(Long workspaceEntityId, WorkspaceChatStatus workspaceChatStatus) {
    WorkspaceChatSettings settings = new WorkspaceChatSettings(workspaceEntityId, workspaceChatStatus);
    getEntityManager().persist(settings);
    return settings;
  }
  
  public List<WorkspaceChatSettings> listAll(String WorkspaceEntityId) {
    EntityManager entityManager = getEntityManager(); 
	    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceChatSettings> criteria = criteriaBuilder.createQuery(WorkspaceChatSettings.class);
    Root<WorkspaceChatSettings> root = criteria.from(WorkspaceChatSettings.class);
    criteria.select(root);
	
    TypedQuery<WorkspaceChatSettings> query = entityManager.createQuery(criteria);
	
    return query.getResultList();
  }
  
  public WorkspaceChatSettings findByWorkspace(Long workspaceEntityId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceChatSettings> criteria = criteriaBuilder.createQuery(WorkspaceChatSettings.class);
    Root<WorkspaceChatSettings> root = criteria.from(WorkspaceChatSettings.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(WorkspaceChatSettings_.workspaceEntityId), workspaceEntityId)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  @Override
  public void delete(WorkspaceChatSettings WorkspaceChatSettings) {
    super.delete(WorkspaceChatSettings);
  }

  public WorkspaceChatSettings updateSettings(WorkspaceChatSettings settings, WorkspaceChatStatus status) {
    settings.setStatus(status);
    
    getEntityManager().persist(settings);
    
    return settings;
  }

}
