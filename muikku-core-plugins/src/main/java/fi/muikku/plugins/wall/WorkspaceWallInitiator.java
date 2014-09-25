package fi.muikku.plugins.wall;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.dao.workspace.WorkspaceEntityDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.wall.dao.WorkspaceWallDAO;
import fi.muikku.schooldata.SchoolDataBridgeEntityInitiator;
import fi.muikku.schooldata.SchoolDataEntityInitiator;
import fi.muikku.schooldata.entity.Workspace;

@SchoolDataBridgeEntityInitiator(entity = Workspace.class)
public class WorkspaceWallInitiator implements SchoolDataEntityInitiator<Workspace> {

  @Inject
  private Logger logger;

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;

  @Inject
  private WorkspaceEntityDAO workspaceEntityDAO;

  @Inject
  private WorkspaceWallDAO workspaceWallDAO;

  @Override
  public Workspace single(Workspace workspace) {
    SchoolDataSource dataSource = schoolDataSourceDAO.findByIdentifier(workspace.getSchoolDataSource());
    WorkspaceEntity workspaceEntity = workspaceEntityDAO.findByDataSourceAndIdentifier(dataSource, workspace.getIdentifier());
    if (workspaceEntity != null) {
      if (workspaceWallDAO.findByWorkspace(workspaceEntity) == null) {
        workspaceWallDAO.create(workspaceEntity);
      }
    } else {
      logger.log(Level.SEVERE, "Could not initiate workspace wall because workspace entity was missing");
    }

    return workspace;
  }

  @Override
  public List<Workspace> list(List<Workspace> workspaces) {
    List<Workspace> result = new ArrayList<>();

    for (Workspace workspace : workspaces) {
      workspace = single(workspace);
      if (workspace != null) {
        result.add(workspace);
      }
    }

    return result;
  }

}
