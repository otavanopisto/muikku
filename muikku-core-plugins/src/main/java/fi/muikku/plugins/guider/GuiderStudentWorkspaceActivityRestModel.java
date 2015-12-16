package fi.muikku.plugins.guider;

import java.util.Date;

public class GuiderStudentWorkspaceActivityRestModel {
  
  public GuiderStudentWorkspaceActivityRestModel() {
  }

  public GuiderStudentWorkspaceActivityRestModel(Date lastVisit, long numVisits, long evaluablesUnanswered, long evaluablesAnswered, Date evaluablesAnsweredLastDate, long evaluablesSubmitted,
      Date evaluablesSubmittedLastDate, long evaluablesEvaluated, Date evaluablesEvaluatedLastDate, double evaluablesDonePercent, long excercicesUnanswered,
      long excercicesAnswered, Date excercicesAnsweredLastDate, double excercicesDonePercent) {
    super();
    this.lastVisit = lastVisit;
    this.numVisits = numVisits;
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

  public void setLastVisit(Date lastVisit) {
    this.lastVisit = lastVisit;
  }
  
  public Date getLastVisit() {
    return lastVisit;
  }
  
  public void setNumVisits(long numVisits) {
    this.numVisits = numVisits;
  }
  
  public long getNumVisits() {
    return numVisits;
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

  private Date lastVisit;
  private long numVisits;
  
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
