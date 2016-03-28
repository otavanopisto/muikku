package fi.otavanopisto.muikku.schooldata.events;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.grading.GradingScaleEntityController;
import fi.otavanopisto.muikku.grading.GradingScaleItemEntityController;
import fi.otavanopisto.muikku.model.coursemeta.CourseIdentifierEntity;
import fi.otavanopisto.muikku.model.grading.GradingScaleEntity;
import fi.otavanopisto.muikku.model.grading.GradingScaleItemEntity;
import fi.otavanopisto.muikku.workspaces.CourseIdentifierEntityController;

public class DefaultSchoolDataMetaListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private CourseIdentifierEntityController courseIdentifierEntityController;

  @Inject
  private GradingScaleEntityController gradingScaleEntityController;

  @Inject
  private GradingScaleItemEntityController gradingScaleItemEntityController;
  
  @PostConstruct
  public void init() {
    discoveredCourseIdentifiers = new HashMap<>();
    discoveredGradingScales = new HashMap<>();
    discoveredGradingScaleItems = new HashMap<>();
  }
  
  public synchronized void onSchoolDataCourseIdentifierDiscoveredEvent(@Observes SchoolDataCourseIdentifierDiscoveredEvent event) {
    String discoverId = "CI-" + event.getDataSource() + "/" + event.getIdentifier();
    if (discoveredCourseIdentifiers.containsKey(discoverId)) {
      event.setDiscoveredCourseIdentifierEntityId(discoveredCourseIdentifiers.get(discoverId));
      return;
    }
    
    CourseIdentifierEntity entity = courseIdentifierEntityController.findCourseIdentifierEntityBySchoolDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier()); 
    if (entity == null) {
      entity = courseIdentifierEntityController.createCourseIdentifierEntity(event.getDataSource(), event.getIdentifier());
      discoveredCourseIdentifiers.put(discoverId, entity.getId());
      event.setDiscoveredCourseIdentifierEntityId(entity.getId());
    } else {
      logger.warning("CourseIdentifierEntity " + event.getIdentifier() + "/" + event.getDataSource() + " already exists");
    }
  }
 
  public synchronized void onSchoolDataGradingScaleDiscoveredEvent(@Observes SchoolDataGradingScaleDiscoveredEvent event) {
    String discoverId = "GS-" + event.getDataSource() + "/" + event.getIdentifier();
    if (discoveredGradingScales.containsKey(discoverId)) {
      event.setDiscoveredGradingScaleEntityId(discoveredGradingScales.get(discoverId));
      return;
    }    
    
    GradingScaleEntity entity = gradingScaleEntityController.findGradingScaleEntityBySchoolDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier()); 
    if (entity == null) {
      entity = gradingScaleEntityController.createGradingScaleEntity(event.getDataSource(), event.getIdentifier());
      discoveredGradingScales.put(discoverId, entity.getId());
      event.setDiscoveredGradingScaleEntityId(entity.getId());
    } else {
      logger.warning("GradingScaleEntity " + event.getIdentifier() + "/" + event.getDataSource() + " already exists");
    }
  }
 
  public void onSchoolDataGradingScaleItemDiscoveredEvent(@Observes SchoolDataGradingScaleItemDiscoveredEvent event) {
    String discoverId = "GSI-" + event.getDataSource() + "/" + event.getIdentifier();
    if (discoveredGradingScaleItems.containsKey(discoverId)) {
      event.setDiscoveredGradingScaleItemEntityId(discoveredGradingScaleItems.get(discoverId));
      return;
    }    
    
    GradingScaleItemEntity scaleItemEntity = gradingScaleItemEntityController.findGradingScaleItemEntityBySchoolDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (scaleItemEntity == null) {
      GradingScaleEntity gradingScaleEntity = gradingScaleEntityController.findGradingScaleEntityBySchoolDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier()); 
      scaleItemEntity = gradingScaleItemEntityController.createGradingScaleEntity(gradingScaleEntity, event.getDataSource(), event.getIdentifier());
      discoveredGradingScaleItems.put(discoverId, scaleItemEntity.getId());
      event.setDiscoveredGradingScaleItemEntityId(scaleItemEntity.getId());
    } else {
      logger.warning("GradingScaleItemEntity " + event.getIdentifier() + "/" + event.getDataSource() + " already exists");
    }
  }

  private Map<String, Long> discoveredCourseIdentifiers;
  private Map<String, Long> discoveredGradingScales;
  private Map<String, Long> discoveredGradingScaleItems;
}
