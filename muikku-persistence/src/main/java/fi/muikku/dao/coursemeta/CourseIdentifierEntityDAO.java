package fi.muikku.dao.coursemeta;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.coursemeta.CourseIdentifierEntity;

@DAO
public class CourseIdentifierEntityDAO extends CoreDAO<CourseIdentifierEntity> {
  
	private static final long serialVersionUID = -295299969009562812L;

	public CourseIdentifierEntity create(Boolean archived) {
    CourseIdentifierEntity courseIdentifierEntity = new CourseIdentifierEntity();
    
    courseIdentifierEntity.setArchived(archived);
    
    getEntityManager().persist(courseIdentifierEntity);
    
    return courseIdentifierEntity;
  }
 
}
