package fi.otavanopisto.muikku.plugins.wall;

import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.enterprise.event.TransactionPhase;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;

public class WallSchoolDataWorkspaceListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private WallController wallController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  public void onSchoolDataWorkspaceUserDiscoveredEvent(@Observes (during = TransactionPhase.BEFORE_COMPLETION) SchoolDataWorkspaceDiscoveredEvent event) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceEntity != null) {
      if (wallController.findWorkspaceWall(workspaceEntity) == null) {
        wallController.createWorkspaceWall(workspaceEntity);
      }
    } else {
      logger.warning("could not init workspace wall because workspace entity #" + event.getIdentifier() + '/' + event.getDataSource() +  " could not be found");
    }
  }
  
}
