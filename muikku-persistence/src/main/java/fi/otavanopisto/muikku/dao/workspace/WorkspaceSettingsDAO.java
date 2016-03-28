package fi.otavanopisto.muikku.dao.workspace;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.workspace.WorkspaceSettings_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceSettings;

public class WorkspaceSettingsDAO extends CoreDAO<WorkspaceSettings> {

	private static final long serialVersionUID = 7487711184683654401L;

	public WorkspaceSettings create(WorkspaceEntity workspaceEntity, WorkspaceRoleEntity defaultUserRole) {
    WorkspaceSettings courseSettings = new WorkspaceSettings();
    
    courseSettings.setWorkspaceEntity(workspaceEntity);
    courseSettings.setDefaultWorkspaceUserRole(defaultUserRole);
    
    getEntityManager().persist(courseSettings);
    return courseSettings;
  }

  public WorkspaceSettings findByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceSettings> criteria = criteriaBuilder.createQuery(WorkspaceSettings.class);
    Root<WorkspaceSettings> root = criteria.from(WorkspaceSettings.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(WorkspaceSettings_.workspaceEntity), workspaceEntity)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public void delete(WorkspaceSettings workspaceSettings) {
    super.delete(workspaceSettings);
  }
  
}
