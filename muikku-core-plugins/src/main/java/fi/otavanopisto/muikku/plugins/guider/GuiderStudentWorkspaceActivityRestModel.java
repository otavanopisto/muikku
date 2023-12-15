package fi.otavanopisto.muikku.plugins.guider;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentState;

public class GuiderStudentWorkspaceActivityRestModel {
  
  public GuiderStudentWorkspaceActivityRestModel() {
  }

  public GuiderStudentWorkspaceActivityRestModel(Date lastVisit, long numVisits, long journalEntryCount, Date lastJournalEntry,
      long evaluablesUnanswered, long evaluablesAnswered, Date evaluablesAnsweredLastDate, long evaluablesSubmitted,
      Date evaluablesSubmittedLastDate, long evaluablesWithdrawn, Date evaluablesWithdrawnLastDate, long evaluablesPassed, Date evaluablesPassedLastDate, 
      long evaluablesFailed, Date evaluablesFailedLastDate, long evaluablesIncomplete, Date evaluablesIncompleteLastDate, 
      long exercisesUnanswered, long exercisesAnswered, Date exercisesAnsweredLastDate, List<WorkspaceAssessmentState> assessmentStates) {
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
    this.evaluablesPassed = evaluablesPassed;
    this.evaluablesPassedLastDate = evaluablesPassedLastDate;
    this.evaluablesWithdrawn = evaluablesWithdrawn;
    this.evaluablesWithdrawnLastDate = evaluablesWithdrawnLastDate;
    this.evaluablesFailed = evaluablesFailed;
    this.evaluablesFailedLastDate = evaluablesFailedLastDate;
    this.evaluablesIncomplete = evaluablesIncomplete;
    this.evaluablesIncompleteLastDate = evaluablesIncompleteLastDate;
    this.exercisesUnanswered = exercisesUnanswered;
    this.exercisesAnswered = exercisesAnswered;
    this.exercisesAnsweredLastDate = exercisesAnsweredLastDate;
    this.assessmentStates = assessmentStates;
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

  public long getEvaluablesFailed() {
    return evaluablesFailed;
  }
  
  public Date getEvaluablesFailedLastDate() {
    return evaluablesFailedLastDate;
  }
  
  public long getEvaluablesPassed() {
    return evaluablesPassed;
  }
  
  public Date getEvaluablesPassedLastDate() {
    return evaluablesPassedLastDate;
  }

  public long getEvaluablesWithdrawn() {
    return evaluablesWithdrawn;
  }
  
  public Date getEvaluablesWithdrawnLastDate() {
    return evaluablesWithdrawnLastDate;
  }

  public long getEvaluablesDonePercent() {
    long done = evaluablesSubmitted + evaluablesPassed + evaluablesFailed + evaluablesIncomplete;
    long total = getEvaluablesTotal();
    return total == 0 ? 0 : Math.round((done * 100) / total);
  }

  public long getExercisesUnanswered() {
    return exercisesUnanswered;
  }

  public long getExercisesAnswered() {
    return exercisesAnswered;
  }

  public Date getExercisesAnsweredLastDate() {
    return exercisesAnsweredLastDate;
  }

  public long getExercisesDonePercent() {
    long done = exercisesAnswered;
    long total = getExercisesTotal();
    return total == 0 ? 0 : Math.round((done * 100) / total);
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
  
  public List<WorkspaceAssessmentState> getAssessmentStates() {
    return assessmentStates;
  }
  
  public void setAssessmentStates(List<WorkspaceAssessmentState> assessmentStates) {
    this.assessmentStates = assessmentStates;
  }

  public long getEvaluablesIncomplete() {
    return evaluablesIncomplete;
  }

  public void setEvaluablesIncomplete(long evaluablesIncomplete) {
    this.evaluablesIncomplete = evaluablesIncomplete;
  }

  public Date getEvaluablesIncompleteLastDate() {
    return evaluablesIncompleteLastDate;
  }

  public void setEvaluablesIncompleteLastDate(Date evaluablesIncompleteLastDate) {
    this.evaluablesIncompleteLastDate = evaluablesIncompleteLastDate;
  }

  public long getEvaluablesTotal() {
    return evaluablesUnanswered +
        evaluablesAnswered +
        evaluablesSubmitted +
        evaluablesWithdrawn +
        evaluablesPassed +
        evaluablesFailed +
        evaluablesIncomplete;
  }

  public long getExercisesTotal() {
    return exercisesUnanswered + exercisesAnswered;
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
  private long evaluablesWithdrawn;
  private Date evaluablesWithdrawnLastDate;
  private long evaluablesPassed;
  private Date evaluablesPassedLastDate;
  private long evaluablesFailed;
  private Date evaluablesFailedLastDate;
  private long evaluablesIncomplete;
  private Date evaluablesIncompleteLastDate;

  private long exercisesUnanswered;
  private long exercisesAnswered;
  private Date exercisesAnsweredLastDate;
  
  private List<WorkspaceAssessmentState> assessmentStates;
}
