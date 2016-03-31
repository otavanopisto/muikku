package fi.otavanopisto.muikku.dao.security;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.security.WorkspaceUserPermissionOverride_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.PermissionOverrideState;
import fi.otavanopisto.muikku.model.security.WorkspaceUserPermissionOverride;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;


public class WorkspaceUserPermissionOverrideDAO extends CoreDAO<WorkspaceUserPermissionOverride> {

	private static final long serialVersionUID = 1051899144879514920L;

	public WorkspaceUserPermissionOverride create(WorkspaceUserEntity workspaceUserEntity, Permission permission, PermissionOverrideState state) {
    WorkspaceUserPermissionOverride override = new WorkspaceUserPermissionOverride();
    
    override.setWorkspaceUserEntity(workspaceUserEntity);
    override.setPermission(permission);
    override.setState(state);
    
    getEntityManager().persist(override);
    
    return override;
  }
  
  public WorkspaceUserPermissionOverride findByCourseUserAndPermission(WorkspaceUserEntity workspaceUserEntity, Permission permission) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceUserPermissionOverride> criteria = criteriaBuilder.createQuery(WorkspaceUserPermissionOverride.class);
    Root<WorkspaceUserPermissionOverride> root = criteria.from(WorkspaceUserPermissionOverride.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceUserPermissionOverride_.workspaceUserEntity), workspaceUserEntity),
            criteriaBuilder.equal(root.get(WorkspaceUserPermissionOverride_.permission), permission)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
