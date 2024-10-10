package fi.otavanopisto.muikku.schooldata.events;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.coursemeta.CourseIdentifierEntity;
import fi.otavanopisto.muikku.workspaces.CourseIdentifierEntityController;

public class DefaultSchoolDataMetaListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private CourseIdentifierEntityController courseIdentifierEntityController;

  @PostConstruct
  public void init() {
    discoveredCourseIdentifiers = new HashMap<>();
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
 
  private Map<String, Long> discoveredCourseIdentifiers;

}
