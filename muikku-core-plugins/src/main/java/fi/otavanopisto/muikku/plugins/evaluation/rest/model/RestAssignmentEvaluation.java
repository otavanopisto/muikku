package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

  public void addAudioAssignmentAudioClip(RestAssignmentEvaluationAudioClip audioClip) {
    this.audioAssignments.add(audioClip);
  }
  
  public List<RestAssignmentEvaluationAudioClip> getAudioAssignments() {
    return audioAssignments;
  }

  public void setAudioAssignments(List<RestAssignmentEvaluationAudioClip> audioAssignments) {
    this.audioAssignments = audioAssignments;
  }

  private RestAssignmentEvaluationType type;
  private String text;
  private Date date;
  private String grade;
  private List<RestAssignmentEvaluationAudioClip> audioAssignments = new ArrayList<>();
}
