package fi.muikku.plugins.guidancetool;

import java.util.Date;

public class StudyActivityWorkspaceAnalysisRestModel {

  public StudyActivityWorkspaceAnalysisRestModel(long evaluablesUnanswered, long evaluablesAnswered, Date evaluablesAnsweredLastDate, long evaluablesSubmitted,
      Date evaluablesSubmittedLastDate, long evaluablesEvaluated, Date evaluablesEvaluatedLastDate, double evaluablesDonePercent, long excercicesUnanswered,
      long excercicesAnswered, Date excercicesAnsweredLastDate, double excercicesDonePercent) {
    super();
    this.evaluablesUnanswered = evaluablesUnanswered;
    this.evaluablesAnswered = evaluablesAnswered;
    this.evaluablesAnsweredLastDate = evaluablesAnsweredLastDate;
    this.evaluablesSubmitted = evaluablesSubmitted;
    this.evaluablesSubmittedLastDate = evaluablesSubmittedLastDate;
    this.evaluablesEvaluated = evaluablesEvaluated;
    this.evaluablesEvaluatedLastDate = evaluablesEvaluatedLastDate;
    this.evaluablesDonePercent = evaluablesDonePercent;
    this.excercicesUnanswered = excercicesUnanswered;
    this.excercicesAnswered = excercicesAnswered;
    this.excercicesAnsweredLastDate = excercicesAnsweredLastDate;
    this.excercicesDonePercent = excercicesDonePercent;
  }

  public long getEvaluablesUnanswered() {
    return evaluablesUnanswered;
  }

  public long getEvaluablesAnswered() {
    return evaluablesAnswered;
  }

  public Date getEvaluablesAnsweredLastDate() {
    return evaluablesAnsweredLastDate;
  }

  public long getEvaluablesSubmitted() {
    return evaluablesSubmitted;
  }

  public Date getEvaluablesSubmittedLastDate() {
    return evaluablesSubmittedLastDate;
  }

  public long getEvaluablesEvaluated() {
    return evaluablesEvaluated;
  }

  public Date getEvaluablesEvaluatedLastDate() {
    return evaluablesEvaluatedLastDate;
  }

  public double getEvaluablesDonePercent() {
    return evaluablesDonePercent;
  }

  public long getExcercicesUnanswered() {
    return excercicesUnanswered;
  }

  public long getExcercicesAnswered() {
    return excercicesAnswered;
  }

  public Date getExcercicesAnsweredLastDate() {
    return excercicesAnsweredLastDate;
  }

  public double getExcercicesDonePercent() {
    return excercicesDonePercent;
  }

  private long evaluablesUnanswered;
  private long evaluablesAnswered;
  private Date evaluablesAnsweredLastDate;
  private long evaluablesSubmitted;
  private Date evaluablesSubmittedLastDate;
  private long evaluablesEvaluated;
  private Date evaluablesEvaluatedLastDate;
  private double evaluablesDonePercent;

  private long excercicesUnanswered;
  private long excercicesAnswered;
  private Date excercicesAnsweredLastDate;
  private double excercicesDonePercent;
}
