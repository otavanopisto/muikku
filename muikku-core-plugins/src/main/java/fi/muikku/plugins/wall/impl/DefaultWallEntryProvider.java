package fi.muikku.plugins.wall.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.wall.WallController;
import fi.muikku.plugins.wall.WallEntryProvider;
import fi.muikku.plugins.wall.WallFeedItem;

import fi.muikku.plugins.wall.WallPermissions;
import fi.muikku.plugins.wall.dao.UserWallDAO;
import fi.muikku.plugins.wall.dao.WallEntryDAO;
import fi.muikku.plugins.wall.dao.WorkspaceWallDAO;
import fi.muikku.plugins.wall.model.UserWall;
import fi.muikku.plugins.wall.model.Wall;
import fi.muikku.plugins.wall.model.WallEntry;
import fi.muikku.plugins.wall.model.WorkspaceWall;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.session.SessionController;

public class DefaultWallEntryProvider implements WallEntryProvider {

  @Inject
  private SessionController sessionController;

  @Inject
  private UserController userController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserWallDAO userWallDAO;

  @Inject
  private WallEntryDAO wallEntryDAO;

  @Inject
  private WorkspaceWallDAO courseWallDAO;

  @Inject
  private WallController wallController;
  
  @Override
  public List<WallFeedItem> listWallEntryItems(Wall wall) {
    // TODO
    if (wall == null)
      return null;

    List<WallEntry> entries = new ArrayList<WallEntry>();
    switch (wall.getWallType()) {
      case USER:
        UserWall userWall = userWallDAO.findById(wall.getId());
  
        UserEntity wallOwner = userController.findUserEntityById(userWall.getUser());
        UserEntity loggedUser = sessionController.isLoggedIn() ? sessionController.getUser() : null;
  
        boolean ownsWall = loggedUser != null ? loggedUser.getId().equals(wallOwner.getId()) : false;
        boolean hasAccess = sessionController.hasEnvironmentPermission(WallPermissions.READ_ALL_WALLS);
  
        if (ownsWall || hasAccess) {
          /**
           * Full access grants full listing of both the users wall and all linked walls
           */
          entries.addAll(wallEntryDAO.listEntriesByWall(wall));
        } else {
          /**
           * When viewing other peoples walls, you only see public or owned entries
           */
          if (sessionController.isLoggedIn())
            entries.addAll(wallEntryDAO.listPublicOrOwnedEntriesByWall(wall, loggedUser));
          else
            entries.addAll(wallEntryDAO.listPublicEntriesByWall(wall));
        }
      break;

      case WORKSPACE:
        WorkspaceWall courseWall = courseWallDAO.findById(wall.getId());
  
        entries.addAll(listWorkspaceEntries(courseWall));
      break;

      case ENVIRONMENT:
        // TODO: oikeudet?
        entries.addAll(wallEntryDAO.listEntriesByWall(wall));
      break;
    }

    List<WallFeedItem> feedItems = new ArrayList<WallFeedItem>();
    for (WallEntry entry : entries) {
      feedItems.add(new WallFeedWallEntryItem(entry));
    }
    return feedItems;
  }
  
  private List<WallEntry> listWorkspaceEntries(WorkspaceWall workspaceWall) {
    List<WallEntry> entries = new ArrayList<WallEntry>();

    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceWall.getWorkspace());

    if (sessionController.hasCoursePermission(WallPermissions.WALL_READALLCOURSEMESSAGES, workspaceEntity)) {
      entries.addAll(wallEntryDAO.listEntriesByWall(workspaceWall));
    } else {
      entries.addAll(wallEntryDAO.listPublicOrOwnedEntriesByWall(workspaceWall, sessionController.getUser()));
    }
    
    return entries;
  }

  @Override
  public List<String> listRequiredJavaScripts() {
    return Arrays.asList(
        "scripts/gui/wall_entry.js"
    );
  }

}
