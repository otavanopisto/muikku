package fi.muikku.plugins.assessmentrequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.forum.dao.ForumThreadDAO;
import fi.muikku.plugins.forum.dao.ForumThreadReplyDAO;
import fi.muikku.plugins.wall.WallController;
import fi.muikku.plugins.wall.WallEntryProvider;
import fi.muikku.plugins.wall.WallFeedItem;
import fi.muikku.plugins.wall.dao.UserWallDAO;
import fi.muikku.plugins.wall.model.Wall;
import fi.muikku.plugins.wall.model.WallType;
import fi.muikku.plugins.wall.model.WorkspaceWall;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.session.SessionController;

public class AssessmentRequestWallEntryProvider implements WallEntryProvider {

  @Inject
  private SessionController sessionController;

  @Inject
  private UserController userController;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserWallDAO userWallDAO;

  @Inject
  private ForumThreadDAO forumThreadDAO;

  @Inject
  private ForumThreadReplyDAO forumThreadReplyDAO;
  
  @Inject
  private WallController wallController;

  @Inject
  private AssessmentRequestController assessmentRequestController;
  
  @Override
  public List<WallFeedItem> listWallEntryItems(Wall wall) {
    List<WallFeedItem> feedItems = new ArrayList<WallFeedItem>();

    if (wall.getWallType() == WallType.WORKSPACE) {
      WorkspaceWall workspaceWall = wallController.findWorkspaceWallById(wall.getId());
      
      WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceWall.getWorkspace());
      
      List<AssessmentRequest> assessmentRequests = assessmentRequestController.listByWorkspace(workspaceEntity);
      
      if (assessmentRequests != null) {
        for (AssessmentRequest assessmentRequest : assessmentRequests) {
          feedItems.add(new UserFeedAssessmentRequestItem(assessmentRequest));
        }
      }
    }
    
    return feedItems;
  }

  @Override
  public List<String> listRequiredJavaScripts() {
    return Arrays.asList(
        "scripts/gui/assessmentrequest_wallentry.js"
    );
  }

}
