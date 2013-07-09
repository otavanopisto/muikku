package fi.muikku.plugins.forum.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.forum.model.CourseForumArea;
import fi.muikku.plugins.forum.model.CourseForumArea_;


@DAO
public class CourseForumAreaDAO extends PluginDAO<CourseForumArea> {
  
	private static final long serialVersionUID = 8627800028194294719L;

	public CourseForumArea create(WorkspaceEntity course, String name, Boolean archived) {
    CourseForumArea courseForumArea = new CourseForumArea();
    
    courseForumArea.setCourse(course.getId());
    courseForumArea.setName(name);
    courseForumArea.setArchived(archived);
    
    getEntityManager().persist(courseForumArea);
    
    return courseForumArea;
  }
  
  public List<CourseForumArea> listByCourse(WorkspaceEntity course) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CourseForumArea> criteria = criteriaBuilder.createQuery(CourseForumArea.class);
    Root<CourseForumArea> root = criteria.from(CourseForumArea.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(CourseForumArea_.course), course.getId())
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
}
