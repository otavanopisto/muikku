package fi.muikku.dao.courses;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.stub.courses.CourseEntity;

@DAO
public class CourseEntityDAO extends CoreDAO<CourseEntity> {
  
	private static final long serialVersionUID = -5129003092406973620L;

	public CourseEntity create(SchoolDataSource dataSource, Boolean archived) {
    CourseEntity course = new CourseEntity();
    
    course.setDataSource(dataSource);
    course.setArchived(archived);
    
    getEntityManager().persist(course);
    
    return course;
  }
  
}
