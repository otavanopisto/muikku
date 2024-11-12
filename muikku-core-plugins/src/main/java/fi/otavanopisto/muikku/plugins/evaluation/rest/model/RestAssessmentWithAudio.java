package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluationType;

public class RestAssessmentWithAudio extends RestAssessment {
  
  public RestAssessmentWithAudio() {
  }

  public RestAssessmentWithAudio(String identifier, String assessorIdentifier, String gradingScaleIdentifier, String gradeIdentifier,
      String verbalAssessment, Date assessmentDate, Boolean passing, Double points, WorkspaceMaterialEvaluationType evaluationType,
      List<RestAssignmentEvaluationAudioClip> audioAssessments) {
    super(identifier, assessorIdentifier, gradingScaleIdentifier, gradeIdentifier, verbalAssessment, assessmentDate, passing, points);
    this.evaluationType = evaluationType;
    this.audioAssessments = audioAssessments;
  }

  public List<RestAssignmentEvaluationAudioClip> getAudioAssessments() {
    return audioAssessments;
  }

  public void setAudioAssessments(List<RestAssignmentEvaluationAudioClip> audioAssessments) {
    this.audioAssessments = audioAssessments;
  }

  public WorkspaceMaterialEvaluationType getEvaluationType() {
    return evaluationType;
  }

  public void setEvaluationType(WorkspaceMaterialEvaluationType evaluationType) {
    this.evaluationType = evaluationType;
  }

  private WorkspaceMaterialEvaluationType evaluationType;
  private List<RestAssignmentEvaluationAudioClip> audioAssessments;
}
