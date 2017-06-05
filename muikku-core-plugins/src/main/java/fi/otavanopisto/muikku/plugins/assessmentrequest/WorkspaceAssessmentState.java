package fi.otavanopisto.muikku.plugins.assessmentrequest;

public enum WorkspaceAssessmentState {
  UNASSESSED("unassessed"),                // no request, no grade
  PENDING("pending"),                      // active request, no grade
  PENDING_PASS("pending_pass"),            // active request, earlier passing grade
  PENDING_FAIL("pending_fail"),            // active request, earlier failing grade
  PASS("pass"),                            // no request, passing grade
  FAIL("fail");                            // no request, failing grade
  
  private WorkspaceAssessmentState(String stateName) {
    this.stateName = stateName;
  }
  
  public String getStateName() {
    return stateName;
  }
  
  private String stateName;
}
