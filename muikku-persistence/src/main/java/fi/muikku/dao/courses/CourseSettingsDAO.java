package fi.muikku.dao.courses;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.courses.CourseSettings;
import fi.muikku.model.courses.CourseSettings_;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class CourseSettingsDAO extends CoreDAO<CourseSettings> {

	private static final long serialVersionUID = 7487711184683654401L;

	public CourseSettings create(WorkspaceEntity courseEntity, WorkspaceRoleEntity defaultUserRole) {
    CourseSettings courseSettings = new CourseSettings();
    
    courseSettings.setCourseEntity(courseEntity);
    courseSettings.setDefaultCourseUserRole(defaultUserRole);
    
    getEntityManager().persist(courseSettings);
    return courseSettings;
  }

  public CourseSettings findByCourse(WorkspaceEntity courseEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CourseSettings> criteria = criteriaBuilder.createQuery(CourseSettings.class);
    Root<CourseSettings> root = criteria.from(CourseSettings.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(CourseSettings_.courseEntity), courseEntity)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
