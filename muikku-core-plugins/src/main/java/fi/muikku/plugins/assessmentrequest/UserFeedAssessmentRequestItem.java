package fi.muikku.plugins.assessmentrequest;

import fi.muikku.plugins.wall.WallFeedItem;
import fi.muikku.schooldata.entity.WorkspaceAssessmentRequest;

public class UserFeedAssessmentRequestItem extends WallFeedItem {

  private WorkspaceAssessmentRequest assessmentRequest;

  public UserFeedAssessmentRequestItem(WorkspaceAssessmentRequest assessmentRequest) {
    super(assessmentRequest.getDate());
    this.assessmentRequest = assessmentRequest;
  }

  public WorkspaceAssessmentRequest getAssessmentRequest() {
    return assessmentRequest;
  }
  
  @Override
  public String getType() {
    return "assessmentRequests";
  }
  
  @Override
  public String getIdentifier() {
    return getAssessmentRequest().getIdentifier();
  }

}
