package fi.otavanopisto.muikku.dao.coursemeta;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.coursemeta.CourseIdentifierEntity;

public class CourseIdentifierEntityDAO extends CoreDAO<CourseIdentifierEntity> {
  
	private static final long serialVersionUID = -295299969009562812L;

	public CourseIdentifierEntity create(Boolean archived) {
    CourseIdentifierEntity courseIdentifierEntity = new CourseIdentifierEntity();
    
    courseIdentifierEntity.setArchived(archived);
    
    getEntityManager().persist(courseIdentifierEntity);
    
    return courseIdentifierEntity;
  }
 
}
