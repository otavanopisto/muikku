package fi.muikku.plugins.guidancerequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.wall.WallController;
import fi.muikku.plugins.wall.WallEntryProvider;
import fi.muikku.plugins.wall.WallFeedItem;
import fi.muikku.plugins.wall.model.UserWall;
import fi.muikku.plugins.wall.model.Wall;
import fi.muikku.plugins.wall.model.WallType;
import fi.muikku.plugins.wall.model.WorkspaceWall;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.WorkspaceController;

public class GuidanceRequestWallEntryProvider implements WallEntryProvider {

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserController userController;

  @Inject
  private WallController wallController;

  @Inject
  private GuidanceRequestController guidanceRequestController;
  
  @Override
  public List<WallFeedItem> listWallEntryItems(Wall wall) {
    List<WallFeedItem> feedItems = new ArrayList<WallFeedItem>();

    if (wall.getWallType() == WallType.WORKSPACE) {
      WorkspaceWall workspaceWall = wallController.findWorkspaceWallById(wall.getId());
      
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceWall.getWorkspace());
      
      // TODO: rights - workspace "manager"
      
      List<WorkspaceGuidanceRequest> requests = guidanceRequestController.listWorkspaceGuidanceRequestsByWorkspace(workspaceEntity);
      
      for (GuidanceRequest request : requests) {
        feedItems.add(new UserFeedGuidanceRequestItem(request));
      }
    }

    if (wall.getWallType() == WallType.USER) {
      UserWall userWall = wallController.findUserWallById(wall.getId());
      
      UserEntity user = userController.findUserEntityById(userWall.getUser());

      // TODO: rights - by user and tutor
      
      List<GuidanceRequest> requests = guidanceRequestController.listGuidanceRequestsByStudent(user);
      
      for (GuidanceRequest request : requests) {
        feedItems.add(new UserFeedGuidanceRequestItem(request));
      }
    }
    
    return feedItems;
  }

  @Override
  public List<String> listRequiredJavaScripts() {
    return Arrays.asList(
        "scripts/gui/guidancerequest_wallentry.js"
    );
  }

}
