package fi.otavanopisto.muikku.workspaces;

import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.dao.coursemeta.CourseIdentifierEntityDAO;
import fi.otavanopisto.muikku.dao.coursemeta.CourseIdentifierSchoolDataIdentifierDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.coursemeta.CourseIdentifierEntity;
import fi.otavanopisto.muikku.model.coursemeta.CourseIdentifierSchoolDataIdentifier;

public class CourseIdentifierEntityController {
  
  @Inject
  private Logger logger;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  @Inject
  private CourseIdentifierEntityDAO courseIdentifierEntityDAO;
  
  @Inject
  private CourseIdentifierSchoolDataIdentifierDAO courseIdentifierSchoolDataIdentifierDAO;

  public CourseIdentifierEntity createCourseIdentifierEntity(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (dataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    CourseIdentifierEntity courseIdentifierEntity = courseIdentifierEntityDAO.create(Boolean.FALSE);
    courseIdentifierSchoolDataIdentifierDAO.create(schoolDataSource, identifier, courseIdentifierEntity);

    return courseIdentifierEntity;
  }
  
  public CourseIdentifierEntity findCourseIdentifierEntityBySchoolDataSourceAndIdentifier(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (dataSource == null) {
      logger.severe("Could not find datasource " + dataSource);
      return null;
    }
    
    CourseIdentifierSchoolDataIdentifier schoolDataIdentifier = courseIdentifierSchoolDataIdentifierDAO.findByDataSourceAndIdentifier(schoolDataSource, identifier);
    if (schoolDataIdentifier != null) {
      return schoolDataIdentifier.getCourseIdentifierEntity();
    }
    
    return null;
  }
  
}
