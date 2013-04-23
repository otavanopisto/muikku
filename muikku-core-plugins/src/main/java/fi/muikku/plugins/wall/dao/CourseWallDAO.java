package fi.muikku.plugins.wall.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.stub.courses.CourseEntity;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.wall.model.CourseWall;
import fi.muikku.plugins.wall.model.CourseWall_;


@DAO
public class CourseWallDAO extends PluginDAO<CourseWall> {

	private static final long serialVersionUID = -4292824493620956200L;

	public CourseWall create(CourseEntity course) {
    CourseWall courseWall = new CourseWall();
    
    courseWall.setCourse(course.getId());
    
    getEntityManager().persist(courseWall);
    
    return courseWall;
  }

  public CourseWall findByCourse(CourseEntity course) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CourseWall> criteria = criteriaBuilder.createQuery(CourseWall.class);
    Root<CourseWall> root = criteria.from(CourseWall.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(CourseWall_.course), course.getId()));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
