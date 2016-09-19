package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import java.util.List;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusIdentifierMapper;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;

@ApplicationScoped
public class PyramusSchoolDataWorkspaceUsersUpdateScheduler extends PyramusDataScheduler implements PyramusUpdateScheduler {

  private static final int BATCH_SIZE = NumberUtils.createInteger(System.getProperty("muikku.pyramus-updater.workspace-users.batchsize", "20"));

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private PyramusIdentifierMapper identityMapper;

  @Inject
  private PyramusUpdater pyramusUpdater;
  
  @Override
  public String getSchedulerName() {
    return "workspace-users";
  }

  public void synchronize() {
    int offset = getOffset();
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus workspace users");

      List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listWorkspaceEntitiesByDataSource(
          SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, offset, BATCH_SIZE);
      if (workspaceEntities.size() == 0) {
        updateOffset(0);
      } else {
        for (WorkspaceEntity workspaceEntity : workspaceEntities) {
          Long courseId = identityMapper.getPyramusCourseId(workspaceEntity.getIdentifier());
          count += pyramusUpdater.updateCourseStaffMembers(courseId);
        }

        updateOffset(offset + workspaceEntities.size());
      }
    } finally {
      logger.fine(String.format("Synchronized %d Pyramus workspace users", count));
    }
  }
  
  @Override
  public int getPriority() {
    return 4;
  }
}
