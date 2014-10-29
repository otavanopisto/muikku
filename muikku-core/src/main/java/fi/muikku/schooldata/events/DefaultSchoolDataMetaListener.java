package fi.muikku.schooldata.events;

import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.model.coursemeta.CourseIdentifierEntity;
import fi.muikku.workspaces.CourseIdentifierEntityController;

public class DefaultSchoolDataMetaListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private CourseIdentifierEntityController courseIdentifierEntityController;
  
  public void onSchoolDataCourseIdentifierDiscoveredEvent(@Observes SchoolDataCourseIdentifierDiscoveredEvent event) {
    CourseIdentifierEntity entity = courseIdentifierEntityController.findCourseIdentifierEntityBySchoolDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier()); 
    if (entity == null) {
      courseIdentifierEntityController.createCourseIdentifierEntity(event.getDataSource(), event.getIdentifier());
    } else {
      logger.warning("CourseIdentifierEntity for " + event.getIdentifier() + "/" + event.getDataSource() + " already exists");
    }
  }
  
}
