package fi.otavanopisto.muikku.plugins.search;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.search.SearchIndexer;

public class WorkspaceIndexer {
  
  @Inject
  private Logger logger;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private SearchIndexer indexer;

  public void indexWorkspace(String dataSource, String indentifier) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceByDataSourceAndIdentifier(dataSource, indentifier);
      if (workspaceEntity != null) {
        Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
        if (workspace != null) {
          indexWorkspace(workspace, workspaceEntity);
        }
      } else {
        logger.warning(String.format("could not index workspace because workspace entity #%s/%s could not be found", indentifier, dataSource));
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public void indexWorkspace(WorkspaceEntity workspaceEntity) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace != null) {
        indexWorkspace(workspace, workspaceEntity);
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  private void indexWorkspace(Workspace workspace, WorkspaceEntity workspaceEntity) {
    try {
      Map<String, Object> extra = new HashMap<>();
      extra.put("published", workspaceEntity.getPublished());
      extra.put("access", workspaceEntity.getAccess());
      
      indexer.index(Workspace.class.getSimpleName(), workspace, extra);
    } catch (Exception e) {
      logger.warning(String.format("could not index workspace #%s/%s", workspace.getIdentifier(), workspace.getSchoolDataSource()));
    }
  }
  
}
