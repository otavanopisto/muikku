package fi.otavanopisto.muikku.plugins.assessmentrequest;

public enum WorkspaceAssessmentState {
  UNASSESSED("unassessed"),
  PENDING("pending"),
  CANCELED("canceled"),
  PASS("pass"),
  FAIL("fail");
  
  private WorkspaceAssessmentState(String stateName) {
    this.stateName = stateName;
  }
  
  public String getStateName() {
    return stateName;
  }
  
  public static WorkspaceAssessmentState fromAssessmentRequestState(AssessmentRequestState state) {
    switch (state) {
    case PENDING:
      return PENDING;
    case CANCELED:
      return CANCELED;
    case PASS:
      return PASS;
    case FAIL:
      return FAIL;
    default:
      throw new NullPointerException("Assessment request state must not be null");
    }
  }
  
  private String stateName;
}
