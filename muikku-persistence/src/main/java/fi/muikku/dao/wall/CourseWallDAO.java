package fi.muikku.dao.wall;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.model.wall.CourseWall;
import fi.muikku.model.wall.CourseWall_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class CourseWallDAO extends CoreDAO<CourseWall> {

	private static final long serialVersionUID = -4292824493620956200L;

	public CourseWall create(CourseEntity course) {
    CourseWall courseWall = new CourseWall();
    
    courseWall.setCourse(course);
    
    getEntityManager().persist(courseWall);
    
    return courseWall;
  }

  public CourseWall findByCourse(CourseEntity course) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CourseWall> criteria = criteriaBuilder.createQuery(CourseWall.class);
    Root<CourseWall> root = criteria.from(CourseWall.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(CourseWall_.course), course));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
