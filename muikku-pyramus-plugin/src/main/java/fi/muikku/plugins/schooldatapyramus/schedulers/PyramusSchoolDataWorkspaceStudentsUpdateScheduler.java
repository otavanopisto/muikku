package fi.muikku.plugins.schooldatapyramus.schedulers;

import java.util.List;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceEntityController;

@ApplicationScoped
public class PyramusSchoolDataWorkspaceStudentsUpdateScheduler implements PyramusUpdateScheduler {

  private static final int BATCH_SIZE = 10;

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private PyramusUpdater pyramusUpdater;

  @Override
  public void synchronize() throws UnexpectedSchoolDataBridgeException {
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus workspace students");

      List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listWorkspaceEntitiesByDataSource(
          SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, offset, BATCH_SIZE);
      if (workspaceEntities.size() == 0) {
        offset = 0;
      } else {
        for (WorkspaceEntity workspaceEntity : workspaceEntities) {
          count += pyramusUpdater.updateWorkspaceStudents(workspaceEntity);
        }

        offset += workspaceEntities.size();
      }
    } finally {
      logger.fine(String.format("Synchronized %d Pyramus workspace students", count));
    }
  }

  private int offset = 0;
}
