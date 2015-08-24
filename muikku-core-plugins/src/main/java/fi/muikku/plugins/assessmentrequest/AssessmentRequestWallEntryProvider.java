package fi.muikku.plugins.assessmentrequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.wall.WallController;
import fi.muikku.plugins.wall.WallEntryProvider;
import fi.muikku.plugins.wall.WallFeedItem;
import fi.muikku.plugins.wall.model.Wall;
import fi.muikku.plugins.wall.model.WallType;
import fi.muikku.plugins.wall.model.WorkspaceWall;
import fi.muikku.schooldata.SchoolDataBridgeRequestException;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.WorkspaceAssessmentRequest;

public class AssessmentRequestWallEntryProvider implements WallEntryProvider {

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WallController wallController;

  @Inject
  private AssessmentRequestController assessmentRequestController;
  
  @Override
  public List<WallFeedItem> listWallEntryItems(Wall wall) {
    List<WallFeedItem> feedItems = new ArrayList<WallFeedItem>();

    try {
      if (wall.getWallType() == WallType.WORKSPACE) {
        WorkspaceWall workspaceWall = wallController.findWorkspaceWallById(wall.getId());
        
        WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(workspaceWall.getWorkspace());
        
        List<WorkspaceAssessmentRequest> assessmentRequests = assessmentRequestController.listByWorkspace(workspaceEntity);
        
        if (assessmentRequests != null) {
          for (WorkspaceAssessmentRequest assessmentRequest : assessmentRequests) {
            feedItems.add(new UserFeedAssessmentRequestItem(assessmentRequest));
          }
        }
      }
    } catch (SchoolDataBridgeRequestException | UnexpectedSchoolDataBridgeException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
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
