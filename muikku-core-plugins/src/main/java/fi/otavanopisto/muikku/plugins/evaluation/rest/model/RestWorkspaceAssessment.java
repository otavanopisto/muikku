package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;

public class RestWorkspaceAssessment extends RestAssessment {
  
  public RestWorkspaceAssessment() {
  }

  public RestWorkspaceAssessment(
      String identifier,
      String workspaceSubjectIdentifier,
      String assessorIdentifier,
      String gradingScaleIdentifier,
      String gradeIdentifier,
      String verbalAssessment,
      Date assessmentDate,
      Boolean passing) {
    super(identifier, assessorIdentifier, gradingScaleIdentifier, gradeIdentifier, verbalAssessment, assessmentDate, passing, null);
    this.workspaceSubjectIdentifier = workspaceSubjectIdentifier;
  }

  public String getWorkspaceSubjectIdentifier() {
    return workspaceSubjectIdentifier;
  }

  public void setWorkspaceSubjectIdentifier(String workspaceSubjectIdentifier) {
    this.workspaceSubjectIdentifier = workspaceSubjectIdentifier;
  }

  private String workspaceSubjectIdentifier;
}
