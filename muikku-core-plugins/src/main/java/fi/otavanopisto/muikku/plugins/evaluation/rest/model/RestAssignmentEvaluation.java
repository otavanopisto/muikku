package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;

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

  private RestAssignmentEvaluationType type;
  private String text;
  private Date date;
  private String grade;

}
