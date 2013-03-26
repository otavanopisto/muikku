package fi.muikku.dao.courses;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.courses.CourseUser;
import fi.muikku.model.courses.CourseUserRole;
import fi.muikku.model.courses.CourseUser_;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.stub.courses.CourseEntity_;
import fi.muikku.model.stub.users.UserEntity;

@DAO
public class CourseUserDAO extends CoreDAO<CourseUser> {

	private static final long serialVersionUID = -850520598378547048L;

	public CourseUser create(UserEntity user, CourseEntity course, CourseUserRole courseUserRole) {
    return create(user, course, courseUserRole, Boolean.FALSE);
  }
  
  public CourseUser create(UserEntity user, CourseEntity course, CourseUserRole courseUserRole, Boolean archived) {
    CourseUser courseUser = new CourseUser();
    
    courseUser.setUser(user);
    courseUser.setCourse(course);
    courseUser.setCourseUserRole(courseUserRole);
    
    courseUser.setArchived(archived);
    
    getEntityManager().persist(courseUser);
    
    return courseUser;
  }

  public CourseUser findByCourseAndUser(CourseEntity course, UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CourseUser> criteria = criteriaBuilder.createQuery(CourseUser.class);
    Root<CourseUser> root = criteria.from(CourseUser.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CourseUser_.course), course),
            criteriaBuilder.equal(root.get(CourseUser_.user), user)
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<CourseEntity> listByUser(UserEntity userEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CourseEntity> criteria = criteriaBuilder.createQuery(CourseEntity.class);
    Root<CourseUser> root = criteria.from(CourseUser.class);
    Join<CourseUser, CourseEntity> join = root.join(CourseUser_.course);
    
    criteria.select(root.get(CourseUser_.course));
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(join.get(CourseEntity_.archived), Boolean.FALSE),
            criteriaBuilder.equal(root.get(CourseUser_.archived), Boolean.FALSE),
            criteriaBuilder.equal(root.get(CourseUser_.user), userEntity)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
