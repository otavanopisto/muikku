package fi.otavanopisto.muikku.plugins.chat.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings_;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;


public class WorkspaceChatSettingsDAO extends CorePluginsDAO<WorkspaceChatSettings> {
	

  private static final long serialVersionUID = 1553231946370134647L;

  public WorkspaceChatSettings create(Long workspaceEntityId, WorkspaceChatStatus workspaceChatStatus) {
    WorkspaceChatSettings settings = new WorkspaceChatSettings(workspaceEntityId, workspaceChatStatus);
    getEntityManager().persist(settings);
    return settings;
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
