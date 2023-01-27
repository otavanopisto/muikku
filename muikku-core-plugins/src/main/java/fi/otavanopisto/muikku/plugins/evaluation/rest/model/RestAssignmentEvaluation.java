package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.plugins.evaluation.model.WorkspaceMaterialEvaluationType;

public class RestAssignmentEvaluation {

  public RestAssignmentEvaluationType getType() {
    return type;
  }

  public void setType(RestAssignmentEvaluationType type) {
    this.type = type;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public String getGrade() {
    return grade;
  }

  public void setGrade(String grade) {
    this.grade = grade;
  }

  public void addAudioAssessmentAudioClip(RestAssignmentEvaluationAudioClip audioClip) {
    this.getAudioAssessments().add(audioClip);
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

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  private Long id;
  private RestAssignmentEvaluationType type;
  private WorkspaceMaterialEvaluationType evaluationType;
  private String text;
  private Date date;
  private String grade;
  private List<RestAssignmentEvaluationAudioClip> audioAssessments = new ArrayList<>();
}
