package fi.otavanopisto.muikku.plugins.coursepicker;

import java.util.List;

import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentState;

public class CanSignupRestModel {
  
  public Boolean getCanSignup() {
    return canSignup;
  }

  public void setCanSignup(Boolean canSignup) {
    this.canSignup = canSignup;
  }

  public List<WorkspaceAssessmentState> getAssessmentStates() {
    return assessmentStates;
  }

  public void setAssessmentStates(List<WorkspaceAssessmentState> assessmentStates) {
    this.assessmentStates = assessmentStates;
  }

  private Boolean canSignup;
  private List<WorkspaceAssessmentState> assessmentStates;

}
