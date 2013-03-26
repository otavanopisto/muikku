package fi.muikku.dao.forum;

import java.util.List;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.forum.CourseForumArea;
import fi.muikku.model.forum.CourseForumArea_;
import fi.muikku.model.stub.courses.CourseEntity;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@DAO
public class CourseForumAreaDAO extends CoreDAO<CourseForumArea> {
  
	private static final long serialVersionUID = 8627800028194294719L;

	public CourseForumArea create(CourseEntity course, String name, Boolean archived) {
    CourseForumArea courseForumArea = new CourseForumArea();
    
    courseForumArea.setCourse(course);
    courseForumArea.setName(name);
    courseForumArea.setArchived(archived);
    
    getEntityManager().persist(courseForumArea);
    
    return courseForumArea;
  }
  
  public List<CourseForumArea> listByCourse(CourseEntity course) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CourseForumArea> criteria = criteriaBuilder.createQuery(CourseForumArea.class);
    Root<CourseForumArea> root = criteria.from(CourseForumArea.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(CourseForumArea_.course), course)
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
