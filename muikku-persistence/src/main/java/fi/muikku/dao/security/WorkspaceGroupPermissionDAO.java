package fi.muikku.dao.security;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.WorkspaceGroupPermission;
import fi.muikku.model.security.WorkspaceGroupPermission_;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.workspace.WorkspaceEntity;


public class WorkspaceGroupPermissionDAO extends CoreDAO<WorkspaceGroupPermission> {

	private static final long serialVersionUID = 3064673748421801577L;

  public WorkspaceGroupPermission create(WorkspaceEntity workspace, UserGroupEntity userGroup, Permission permission) {
	  WorkspaceGroupPermission curpermission = new WorkspaceGroupPermission();
    
    curpermission.setWorkspace(workspace);
    curpermission.setUserGroup(userGroup);
    curpermission.setPermission(permission);
    
    getEntityManager().persist(curpermission);
    
    return curpermission;
  }
  
	// TODO: Not a DAO method
  public boolean hasWorkspacePermissionAccess(WorkspaceEntity workspace, UserGroupEntity userGroup, Permission permission) {
    return findByGroupAndPermission(workspace, userGroup, permission) != null;
  }

  public WorkspaceGroupPermission findByGroupAndPermission(WorkspaceEntity course, UserGroupEntity userGroup, Permission permission) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceGroupPermission> criteria = criteriaBuilder.createQuery(WorkspaceGroupPermission.class);
    Root<WorkspaceGroupPermission> root = criteria.from(WorkspaceGroupPermission.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(WorkspaceGroupPermission_.workspace), course),
            criteriaBuilder.equal(root.get(WorkspaceGroupPermission_.userGroup), userGroup),
            criteriaBuilder.equal(root.get(WorkspaceGroupPermission_.permission), permission)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<WorkspaceGroupPermission> listByWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceGroupPermission> criteria = criteriaBuilder.createQuery(WorkspaceGroupPermission.class);
    Root<WorkspaceGroupPermission> root = criteria.from(WorkspaceGroupPermission.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(WorkspaceGroupPermission_.workspace), workspaceEntity)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  @Override
  public void delete(WorkspaceGroupPermission workspaceRolePermission) {
    super.delete(workspaceRolePermission);
  }
  
}
