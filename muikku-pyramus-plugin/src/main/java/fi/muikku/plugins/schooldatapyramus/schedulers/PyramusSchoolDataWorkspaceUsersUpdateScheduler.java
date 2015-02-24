package fi.muikku.plugins.schooldatapyramus.schedulers;

import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.schooldatapyramus.PyramusIdentifierMapper;
import fi.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceEntityController;

@Dependent
@Stateful
public class PyramusSchoolDataWorkspaceUsersUpdateScheduler implements PyramusUpdateScheduler {

  private static final int BATCH_SIZE = 10;

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private PyramusIdentifierMapper identityMapper;

  @Inject
  private PyramusUpdater pyramusUpdater;

  public void synchronize() throws UnexpectedSchoolDataBridgeException {

    int count = 0;
    try {
      logger.info("Synchronizing Pyramus workspace users");

      List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listWorkspaceEntitiesByDataSource(
          SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, offset, BATCH_SIZE);
      if (workspaceEntities.size() == 0) {
        offset = 0;
      } else {
        for (WorkspaceEntity workspaceEntity : workspaceEntities) {
          Long courseId = identityMapper.getPyramusCourseId(workspaceEntity.getIdentifier());
          count += pyramusUpdater.updateCourseStaffMembers(courseId);
        }

        offset += workspaceEntities.size();
      }
    } finally {
      logger.info(String.format("Synchronized %d Pyramus workspace users", count));
    }
  }

  private int offset = 0;
}
