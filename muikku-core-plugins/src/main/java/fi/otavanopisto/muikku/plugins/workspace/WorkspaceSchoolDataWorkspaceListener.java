package fi.otavanopisto.muikku.plugins.workspace;

import java.util.logging.Logger;

import javax.enterprise.event.Observes;
import javax.enterprise.event.TransactionPhase;
import javax.inject.Inject;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.events.SchoolDataWorkspaceDiscoveredEvent;

public class WorkspaceSchoolDataWorkspaceListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceMaterialController workspaceMaterialController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  public void onSchoolDataWorkspaceUserDiscoveredEvent(@Observes (during = TransactionPhase.BEFORE_COMPLETION) SchoolDataWorkspaceDiscoveredEvent event) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(event.getDataSource(), event.getIdentifier());
    if (workspaceEntity != null) {
      WorkspaceRootFolder rootFolder = workspaceMaterialController.findWorkspaceRootFolderByWorkspaceEntity(workspaceEntity);
      if (rootFolder == null) {
        workspaceMaterialController.createWorkspaceRootFolder(workspaceEntity);
      }
    } else {
      logger.warning("could not init workspace root folder because workspace entity #" + event.getIdentifier() + '/' + event.getDataSource() +  " could not be found");
    }
  }
  
}
