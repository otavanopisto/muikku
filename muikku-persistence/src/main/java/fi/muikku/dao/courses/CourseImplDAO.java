package fi.muikku.dao.courses;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.courses.CourseImpl;
import fi.muikku.model.courses.CourseImpl_;
import fi.muikku.model.stub.courses.CourseEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class CourseImplDAO extends CoreDAO<CourseImpl> {
  
	private static final long serialVersionUID = 7511049907972226479L;

	public CourseImpl create(CourseEntity courseEntity, String name, String description) {
    return create(courseEntity, name, description, Boolean.FALSE);
  }

  public CourseImpl create(CourseEntity courseEntity, String name, String description, Boolean archived) {
    CourseImpl course = new CourseImpl();
    
    course.setCourseEntity(courseEntity);
    course.setName(name);
    course.setDescription(description);
    course.setArchived(archived);
    
    getEntityManager().persist(course);
    
    return course;
  }

  public CourseImpl findByCourseEntity(CourseEntity courseEntity) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CourseImpl> criteria = criteriaBuilder.createQuery(CourseImpl.class);
    Root<CourseImpl> root = criteria.from(CourseImpl.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(CourseImpl_.courseEntity), courseEntity));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
