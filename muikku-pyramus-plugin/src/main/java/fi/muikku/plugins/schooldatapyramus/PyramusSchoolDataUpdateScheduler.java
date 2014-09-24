package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.inject.Inject;

import fi.muikku.plugins.schooldatapyramus.entities.PyramusWorkspace;
import fi.muikku.plugins.schooldatapyramus.rest.SystemPyramusClient;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.initializers.SchoolDataEntityInitializerProvider;
import fi.pyramus.rest.model.Course;

@Singleton
public class PyramusSchoolDataUpdateScheduler {
  
  @Inject
  private Logger logger;

  @Inject
  private SystemPyramusClient pyramusClient;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private SchoolDataEntityInitializerProvider schoolDataEntityInitializerProvider;

  @Schedule(minute = "*/1", hour = "*", persistent = false)
  public void synchronizeWorkspaces() throws UnexpectedSchoolDataBridgeException {
    logger.info("Synchronizing Workspaces from Pyramus");
    
    List<String> existingIds = workspaceEntityController.listWorkspaceEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    
    Course[] courses = pyramusClient.get("/courses/courses/", Course[].class);
    if (courses == null) {
      logger.warning("Could not synchronize courses from Pyramus");
    } else {
      List<Workspace> newWorkspaces = new ArrayList<>();
      
      for (Course course : courses) {
        Workspace workspace = createEntity(course);
        
        if (!existingIds.contains(workspace.getIdentifier())) {
          newWorkspaces.add(workspace);
        }
  
        existingIds.remove(workspace.getIdentifier());
      }
  
      schoolDataEntityInitializerProvider.initWorkspaces(newWorkspaces);
      
      logger.info("Synchronized " + newWorkspaces.size() + " workspaces from Pyramus");
    }
  }

  private Workspace createEntity(Course course) {
    if (course == null) {
      return null;
    }
    
    return new PyramusWorkspace(course.getId().toString(), course.getName(), course.getDescription(), "TODO", "TODO");
  }
}
