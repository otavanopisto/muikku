package fi.muikku.dao.security;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.security.CourseUserRolePermission;
import fi.muikku.model.security.CourseUserRolePermission_;
import fi.muikku.model.security.Permission;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.users.UserRole;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class CourseUserRolePermissionDAO extends CoreDAO<CourseUserRolePermission> {

	private static final long serialVersionUID = 7065441642441234058L;

	public CourseUserRolePermission create(CourseEntity course, UserRole userRole, Permission permission) {
    CourseUserRolePermission curpermission = new CourseUserRolePermission();
    
    curpermission.setCourse(course);
    curpermission.setUserRole(userRole);
    curpermission.setPermission(permission);
    
    getEntityManager().persist(curpermission);
    
    return curpermission;
  }
  
  public boolean hasCoursePermissionAccess(CourseEntity course, UserRole userRole, Permission permission) {
    return findByUserRoleAndPermission(course, userRole, permission) != null;
  }

  public CourseUserRolePermission findByUserRoleAndPermission(CourseEntity course, UserRole userRole, Permission permission) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CourseUserRolePermission> criteria = criteriaBuilder.createQuery(CourseUserRolePermission.class);
    Root<CourseUserRolePermission> root = criteria.from(CourseUserRolePermission.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CourseUserRolePermission_.course), course),
            criteriaBuilder.equal(root.get(CourseUserRolePermission_.userRole), userRole),
            criteriaBuilder.equal(root.get(CourseUserRolePermission_.permission), permission)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  @Override
  public void delete(CourseUserRolePermission courseUserRolePermission) {
    super.delete(courseUserRolePermission);
  }
  
}
