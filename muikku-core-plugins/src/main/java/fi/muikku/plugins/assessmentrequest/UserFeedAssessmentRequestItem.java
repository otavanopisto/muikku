package fi.muikku.plugins.assessmentrequest;

import fi.muikku.plugins.wall.WallFeedItem;
import fi.tranquil.TranquilEntity;

@TranquilEntity
public class UserFeedAssessmentRequestItem extends WallFeedItem {

  private AssessmentRequest assessmentRequest;

  public UserFeedAssessmentRequestItem(AssessmentRequest assessmentRequest) {
    super(assessmentRequest.getDate(), "wall/assessmentrequestwallentry.dust");
    this.assessmentRequest = assessmentRequest;
  }

  public AssessmentRequest getAssessmentRequest() {
    return assessmentRequest;
  }

}
