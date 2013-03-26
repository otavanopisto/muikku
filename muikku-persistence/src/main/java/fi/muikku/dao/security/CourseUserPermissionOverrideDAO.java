package fi.muikku.dao.security;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.courses.CourseUser;
import fi.muikku.model.security.CourseUserPermissionOverride;
import fi.muikku.model.security.CourseUserPermissionOverride_;
import fi.muikku.model.security.Permission;
import fi.muikku.model.security.PermissionOverrideState;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class CourseUserPermissionOverrideDAO extends CoreDAO<CourseUserPermissionOverride> {

	private static final long serialVersionUID = 1051899144879514920L;

	public CourseUserPermissionOverride create(CourseUser courseUser, Permission permission, PermissionOverrideState state) {
    CourseUserPermissionOverride override = new CourseUserPermissionOverride();
    
    override.setCourseUser(courseUser);
    override.setPermission(permission);
    override.setState(state);
    
    getEntityManager().persist(override);
    
    return override;
  }
  
  public CourseUserPermissionOverride findByCourseUserAndPermission(CourseUser courseUser, Permission permission) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CourseUserPermissionOverride> criteria = criteriaBuilder.createQuery(CourseUserPermissionOverride.class);
    Root<CourseUserPermissionOverride> root = criteria.from(CourseUserPermissionOverride.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CourseUserPermissionOverride_.courseUser), courseUser),
            criteriaBuilder.equal(root.get(CourseUserPermissionOverride_.permission), permission)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
