package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.events.ContextInitializedEvent;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusSchoolDataEntityFactory;
import fi.muikku.plugins.schooldatapyramus.entities.PyramusWorkspace;
import fi.muikku.plugins.schooldatapyramus.rest.SystemPyramusClient;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.initializers.SchoolDataEntityInitializerProvider;
import fi.pyramus.rest.model.Course;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.CourseStudent;

@Singleton
public class PyramusSchoolDataWorkspaceUpdateScheduler {
  
  private static final int BATCH_LIMIT = 100;
  
  @Inject
  private Logger logger;

  @Inject
  private SystemPyramusClient pyramusClient;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private SchoolDataEntityInitializerProvider schoolDataEntityInitializerProvider;

  @Inject
  private PyramusSchoolDataEntityFactory entityFactory;
  
  @PostConstruct
  public void init() {
    contextInitialized = false;
  }
  
  public void onContextInitialized(@Observes ContextInitializedEvent event) {
    contextInitialized = true;
  }
  
  @Schedule(minute = "*/1", hour = "*", persistent = false)
  public void synchronizeWorkspaces() throws UnexpectedSchoolDataBridgeException {
    if (contextInitialized) {
      logger.info("Synchronizing Workspaces from Pyramus");
      
      List<String> existingIds = workspaceEntityController.listWorkspaceEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
      
      Course[] courses = pyramusClient.get("/courses/courses/", Course[].class);
      if (courses == null) {
        logger.info("Could not synchronize courses from Pyramus");
      } else {
        Map<String, Course> courseMap = new HashMap<>();
        
        List<Workspace> newWorkspaces = new ArrayList<>();
        List<Workspace> workspaces = new ArrayList<>();
        
        for (Course course : courses) {
          Workspace workspace = createEntity(course);
          
          if (!existingIds.contains(workspace.getIdentifier())) {
            newWorkspaces.add(workspace);
          } 
          
          workspaces.add(workspace);
    
          existingIds.remove(workspace.getIdentifier());
          if (newWorkspaces.size() >= BATCH_LIMIT) {
            logger.info("Limiting size of synchronization batch into " + BATCH_LIMIT);
            break; 
          }
          
          courseMap.put(workspace.getIdentifier(), course);
        }
        
        logger.info("Synchronizing " + newWorkspaces.size() + " new workspaces from Pyramus");
        
        schoolDataEntityInitializerProvider.initWorkspaces(newWorkspaces);
        
        for (Workspace workspace : workspaces) {
          Course course = courseMap.get(workspace.getIdentifier());
          
          CourseStaffMember[] staffMembers = pyramusClient.get("/courses/courses/" + course.getId() + "/staffMembers", CourseStaffMember[].class);
          schoolDataEntityInitializerProvider.initWorkspaceUsers(entityFactory.createEntity(staffMembers));

          CourseStudent[] courseStudents = pyramusClient.get("/courses/courses/" + course.getId() + "/students", CourseStudent[].class);
          schoolDataEntityInitializerProvider.initWorkspaceUsers(entityFactory.createEntity(courseStudents));
        }
        
        logger.info("Synchronized " + newWorkspaces.size() + " workspaces from Pyramus");
      }
    }
  }

  private Workspace createEntity(Course course) {
    if (course == null) {
      return null;
    }
    
    return new PyramusWorkspace(course.getId().toString(), course.getName(), course.getDescription(), "TODO", "TODO");
  }
  
  private boolean contextInitialized;
}
