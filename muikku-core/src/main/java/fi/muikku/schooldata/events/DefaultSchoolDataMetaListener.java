package fi.muikku.schooldata.events;

import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.grading.GradingScaleEntityController;
import fi.muikku.grading.GradingScaleItemEntityController;
import fi.muikku.model.coursemeta.CourseIdentifierEntity;
import fi.muikku.model.grading.GradingScaleEntity;
import fi.muikku.model.grading.GradingScaleItemEntity;
import fi.muikku.workspaces.CourseIdentifierEntityController;

public class DefaultSchoolDataMetaListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private CourseIdentifierEntityController courseIdentifierEntityController;

  @Inject
  private GradingScaleEntityController gradingScaleEntityController;

  @Inject
  private GradingScaleItemEntityController gradingScaleItemEntityController;
  
  public void onSchoolDataCourseIdentifierDiscoveredEvent(@Observes SchoolDataCourseIdentifierDiscoveredEvent event) {
    CourseIdentifierEntity entity = courseIdentifierEntityController.findCourseIdentifierEntityBySchoolDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier()); 
    if (entity == null) {
      courseIdentifierEntityController.createCourseIdentifierEntity(event.getDataSource(), event.getIdentifier());
    } else {
      logger.warning("CourseIdentifierEntity " + event.getIdentifier() + "/" + event.getDataSource() + " already exists");
    }
  }
 
  public void onSchoolDataGradingScaleDiscoveredEvent(@Observes SchoolDataGradingScaleDiscoveredEvent event) {
    GradingScaleEntity entity = gradingScaleEntityController.findGradingScaleEntityBySchoolDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier()); 
    if (entity == null) {
      gradingScaleEntityController.createGradingScaleEntity(event.getDataSource(), event.getIdentifier());
    } else {
      logger.warning("GradingScaleEntity " + event.getIdentifier() + "/" + event.getDataSource() + " already exists");
    }
  }
 
  public void onSchoolDataGradingScaleItemDiscoveredEvent(@Observes SchoolDataGradingScaleItemDiscoveredEvent event) {
    GradingScaleItemEntity scaleItemEntity = gradingScaleItemEntityController.findGradingScaleItemEntityBySchoolDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (scaleItemEntity == null) {
      GradingScaleEntity gradingScaleEntity = gradingScaleEntityController.findGradingScaleEntityBySchoolDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier()); 
      gradingScaleItemEntityController.createGradingScaleEntity(gradingScaleEntity, event.getDataSource(), event.getIdentifier());
    } else {
      logger.warning("GradingScaleItemEntity " + event.getIdentifier() + "/" + event.getDataSource() + " already exists");
    }
  }
}
