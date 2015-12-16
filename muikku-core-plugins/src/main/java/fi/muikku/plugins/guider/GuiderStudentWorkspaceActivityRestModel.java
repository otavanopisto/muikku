package fi.muikku.plugins.guider;

import java.util.Date;

import fi.muikku.plugins.assessmentrequest.WorkspaceAssessmentState;

public class GuiderStudentWorkspaceActivityRestModel {
  
  public GuiderStudentWorkspaceActivityRestModel() {
  }

  public GuiderStudentWorkspaceActivityRestModel(Date lastVisit, long numVisits, long journalEntryCount, Date lastJournalEntry,
      long evaluablesUnanswered, long evaluablesAnswered, Date evaluablesAnsweredLastDate, long evaluablesSubmitted,
      Date evaluablesSubmittedLastDate, long evaluablesEvaluated, Date evaluablesEvaluatedLastDate, double evaluablesDonePercent, 
      long excercicesUnanswered, long excercicesAnswered, Date excercicesAnsweredLastDate, double excercicesDonePercent,
      WorkspaceAssessmentState assessmentState) {
    super();
    this.lastVisit = lastVisit;
    this.numVisits = numVisits;
    this.journalEntryCount = journalEntryCount;
    this.lastJournalEntry = lastJournalEntry;
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
    this.assessmentState = assessmentState;
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

  public long getJournalEntryCount() {
    return journalEntryCount;
  }
  
  public void setJournalEntryCount(long journalEntryCount) {
    this.journalEntryCount = journalEntryCount;
  }
  
  public Date getLastJournalEntry() {
    return lastJournalEntry;
  }
  
  public void setLastJournalEntry(Date lastJournalEntry) {
    this.lastJournalEntry = lastJournalEntry;
  }
  
  public WorkspaceAssessmentState getAssessmentState() {
    return assessmentState;
  }
  
  public void setAssessmentState(WorkspaceAssessmentState assessmentState) {
    this.assessmentState = assessmentState;
  }

  private Date lastVisit;
  private long numVisits;
  
  private long journalEntryCount;
  private Date lastJournalEntry;
  
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
  
  private WorkspaceAssessmentState assessmentState;
}
