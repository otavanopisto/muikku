package fi.otavanopisto.muikku.plugins.workspace.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceToolSettings_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceToolSettings;

public class WorkspaceToolSettingsDAO extends CorePluginsDAO<WorkspaceToolSettings> {

  private static final long serialVersionUID = 435773625480606769L;

  public WorkspaceToolSettings create(Long workspaceEntityId, String name, Boolean visible) {
    WorkspaceToolSettings workspaceToolSettings = new WorkspaceToolSettings();

    workspaceToolSettings.setWorkspaceEntityId(workspaceEntityId);
    workspaceToolSettings.setName(name);
    workspaceToolSettings.setVisible(visible);
    
    return persist(workspaceToolSettings);
  }
  
  public WorkspaceToolSettings findByWorkspaceEntityIdAndName(Long workspaceEntityId, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceToolSettings> criteria = criteriaBuilder.createQuery(WorkspaceToolSettings.class);
    Root<WorkspaceToolSettings> root = criteria.from(WorkspaceToolSettings.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceToolSettings_.name), name),
        criteriaBuilder.equal(root.get(WorkspaceToolSettings_.workspaceEntityId), workspaceEntityId)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
