package fi.muikku.dao.security;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.WorkspaceRolePermission;
import fi.muikku.model.security.WorkspaceRolePermission_;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.workspace.WorkspaceEntity;


@DAO
public class WorkspaceRolePermissionDAO extends CoreDAO<WorkspaceRolePermission> {

	private static final long serialVersionUID = 7065441642441234058L;

	public WorkspaceRolePermission create(WorkspaceEntity workspace, RoleEntity role, Permission permission) {
    WorkspaceRolePermission curpermission = new WorkspaceRolePermission();
    
    curpermission.setWorkspace(workspace);
    curpermission.setRole(role);
    curpermission.setPermission(permission);
    
    getEntityManager().persist(curpermission);
    
    return curpermission;
  }
  
	// TODO: Not a DAO method
  public boolean hasCoursePermissionAccess(WorkspaceEntity workspace, RoleEntity role, Permission permission) {
    return findByRoleAndPermission(workspace, role, permission) != null;
  }

  public WorkspaceRolePermission findByRoleAndPermission(WorkspaceEntity course, RoleEntity role, Permission permission) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceRolePermission> criteria = criteriaBuilder.createQuery(WorkspaceRolePermission.class);
    Root<WorkspaceRolePermission> root = criteria.from(WorkspaceRolePermission.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceRolePermission_.workspace), course),
            criteriaBuilder.equal(root.get(WorkspaceRolePermission_.role), role),
            criteriaBuilder.equal(root.get(WorkspaceRolePermission_.permission), permission)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  @Override
  public void delete(WorkspaceRolePermission workspaceUserRolePermission) {
    super.delete(workspaceUserRolePermission);
  }
  
}
