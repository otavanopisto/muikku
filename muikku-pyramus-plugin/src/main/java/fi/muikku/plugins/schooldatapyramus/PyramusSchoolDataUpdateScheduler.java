package fi.muikku.plugins.schooldatapyramus;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.inject.Inject;

import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.schooldata.initializers.SchoolDataEntityInitializerProvider;

@Singleton
public class PyramusSchoolDataUpdateScheduler {
  
  @Inject
  private Logger logger;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private SchoolDataEntityInitializerProvider schoolDataEntityInitializerProvider;

  @Schedule(minute = "*/1", hour = "*", persistent = false)
  public void synchronizeWorkspaces() throws UnexpectedSchoolDataBridgeException {
    logger.info("Synchronizing Workspaces from Pyramus");
    
    List<String> existingIds = workspaceEntityController.listWorkspaceEntityIdentifiersByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    List<Workspace> workspaces = workspaceController.listWorkspaces(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE);
    List<Workspace> newWorkspaces = new ArrayList<>();
    
    for (Workspace workspace : workspaces) {
      if (!existingIds.contains(workspace.getIdentifier())) {
        newWorkspaces.add(workspace);
      }

      existingIds.remove(workspace.getIdentifier());
    }

    schoolDataEntityInitializerProvider.initWorkspaces(newWorkspaces);
    
    logger.info("Synchronized " + newWorkspaces.size() + " workspaces from Pyramus");
  }

}
