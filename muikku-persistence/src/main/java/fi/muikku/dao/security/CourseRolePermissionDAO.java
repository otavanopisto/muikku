package fi.muikku.dao.security;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.security.CourseRolePermission;
import fi.muikku.model.security.CourseRolePermission_;
import fi.muikku.model.security.Permission;
import fi.muikku.model.users.RoleEntity;
import fi.muikku.model.workspace.WorkspaceEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class CourseRolePermissionDAO extends CoreDAO<CourseRolePermission> {

	private static final long serialVersionUID = 7065441642441234058L;

	public CourseRolePermission create(WorkspaceEntity course, RoleEntity role, Permission permission) {
    CourseRolePermission curpermission = new CourseRolePermission();
    
    curpermission.setCourse(course);
    curpermission.setRole(role);
    curpermission.setPermission(permission);
    
    getEntityManager().persist(curpermission);
    
    return curpermission;
  }
  
	// TODO: Not a DAO method
  public boolean hasCoursePermissionAccess(WorkspaceEntity course, RoleEntity role, Permission permission) {
    return findByRoleAndPermission(course, role, permission) != null;
  }

  public CourseRolePermission findByRoleAndPermission(WorkspaceEntity course, RoleEntity role, Permission permission) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CourseRolePermission> criteria = criteriaBuilder.createQuery(CourseRolePermission.class);
    Root<CourseRolePermission> root = criteria.from(CourseRolePermission.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CourseRolePermission_.course), course),
            criteriaBuilder.equal(root.get(CourseRolePermission_.role), role),
            criteriaBuilder.equal(root.get(CourseRolePermission_.permission), permission)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  @Override
  public void delete(CourseRolePermission courseUserRolePermission) {
    super.delete(courseUserRolePermission);
  }
  
}
