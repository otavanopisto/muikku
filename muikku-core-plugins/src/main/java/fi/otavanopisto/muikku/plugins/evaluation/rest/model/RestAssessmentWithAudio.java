package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceNodeEvaluationType;

public class RestAssessmentWithAudio extends RestAssessment {
  
  public RestAssessmentWithAudio() {
  }

  public RestAssessmentWithAudio(String identifier, String assessorIdentifier, String gradingScaleIdentifier, String gradeIdentifier,
      String verbalAssessment, Date assessmentDate, Boolean passing, Double points, boolean archived, WorkspaceNodeEvaluationType evaluationType,
      List<RestAssignmentEvaluationAudioClip> audioAssessments) {
    super(identifier, assessorIdentifier, gradingScaleIdentifier, gradeIdentifier, verbalAssessment, assessmentDate, passing, points);
    this.evaluationType = evaluationType;
    this.audioAssessments = audioAssessments;
    this.setArchived(archived);
  }

  public List<RestAssignmentEvaluationAudioClip> getAudioAssessments() {
    return audioAssessments;
  }

  public void setAudioAssessments(List<RestAssignmentEvaluationAudioClip> audioAssessments) {
    this.audioAssessments = audioAssessments;
  }

  public WorkspaceNodeEvaluationType getEvaluationType() {
    return evaluationType;
  }

  public void setEvaluationType(WorkspaceNodeEvaluationType evaluationType) {
    this.evaluationType = evaluationType;
  }

  public boolean isArchived() {
    return archived;
  }

  public void setArchived(boolean archived) {
    this.archived = archived;
  }

  private WorkspaceNodeEvaluationType evaluationType;
  private List<RestAssignmentEvaluationAudioClip> audioAssessments;
  private boolean archived;
}
