package fi.muikku.schooldata.initializers;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.coursemeta.CourseIdentifierEntityDAO;
import fi.muikku.dao.coursemeta.CourseIdentifierSchoolDataIdentifierDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.coursemeta.CourseIdentifierEntity;
import fi.muikku.model.coursemeta.CourseIdentifierSchoolDataIdentifier;
import fi.muikku.schooldata.entity.CourseIdentifier;

@Stateless
@Dependent
public class CourseIdentifierSchoolDataEntityInitializer implements SchoolDataCourseIdentifierInitializer {
	
	@Inject
	private SchoolDataSourceDAO schoolDataSourceDAO;
	
	@Inject
	private CourseIdentifierEntityDAO courseIdentifierEntityDAO;
	
	@Inject
	private CourseIdentifierSchoolDataIdentifierDAO courseIdentifierSchoolDataIdentifierDAO;

  @Override
  public List<CourseIdentifier> init(List<CourseIdentifier> courseIdentifiers) {
    List<CourseIdentifier> result = new ArrayList<>();
    
    for (CourseIdentifier courseIdentifier : courseIdentifiers) {
      courseIdentifier = init(courseIdentifier);
      if (courseIdentifier != null) {
        result.add(courseIdentifier);
      }
    }
    
    return result;
  }
  
  private CourseIdentifier init(CourseIdentifier courseIdentifier) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(courseIdentifier.getSchoolDataSource());
    if (dataSource != null) {
      CourseIdentifierSchoolDataIdentifier schoolDataIdentifier = courseIdentifierSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(dataSource, courseIdentifier.getIdentifier());
      if (schoolDataIdentifier == null) {
        CourseIdentifierEntity courseIdentifierEntity = courseIdentifierEntityDAO.create(Boolean.FALSE);
        courseIdentifierSchoolDataIdentifierDAO.create(dataSource, courseIdentifier.getIdentifier(), courseIdentifierEntity);
      }
    }

    return courseIdentifier;
  }
}
