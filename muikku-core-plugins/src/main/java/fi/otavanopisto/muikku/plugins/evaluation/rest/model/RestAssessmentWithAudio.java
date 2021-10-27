package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;
import java.util.List;

public class RestAssessmentWithAudio extends RestAssessment {
  
  public RestAssessmentWithAudio() {
  }

  public RestAssessmentWithAudio(String identifier, String assessorIdentifier, String gradingScaleIdentifier, String gradeIdentifier, String verbalAssessment, Date assessmentDate, Boolean passing, List<RestAssignmentEvaluationAudioClip> audioAssessments) {
    super(identifier, assessorIdentifier, gradingScaleIdentifier, gradeIdentifier, verbalAssessment, assessmentDate, passing);
    this.audioAssessments = audioAssessments;
  }

  public List<RestAssignmentEvaluationAudioClip> getAudioAssessments() {
    return audioAssessments;
  }

  public void setAudioAssessments(List<RestAssignmentEvaluationAudioClip> audioAssessments) {
    this.audioAssessments = audioAssessments;
  }

  private List<RestAssignmentEvaluationAudioClip> audioAssessments;
}
