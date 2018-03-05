package fi.otavanopisto.muikku.plugins.guider;

import java.util.Date;

public class GuiderStudentWorkspaceActivity {

  public Evaluables getEvaluables() {
    return evaluables;
  }
  
  public Exercises getExercises() {
    return exercises;
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
  
  private Evaluables evaluables = new Evaluables();
  private Exercises exercises = new Exercises();
  private Date lastVisit;
  private long numVisits;
  private long journalEntryCount;
  private Date lastJournalEntry;
  
  public static class Evaluables {

    public void addUnanswered() {
      unanswered++;
    }
    
    public void addAnswered(Date date) {
      answeredLastDate = getLatest(date, answeredLastDate);
      answered++;
    }
    
    public void addSubmitted(Date date) {
      submittedLastDate = getLatest(date, submittedLastDate);
      submitted++;
    }
    
    public void addWithdrawn(Date date) {
      withdrawnLastDate = getLatest(date, withdrawnLastDate);
      withdrawn++;
    }

    public void addPassed(Date date) {
      passedLastDate = getLatest(date, passedLastDate);
      passed++;
    }
    
    public void addFailed(Date date) {
      failedLastDate = getLatest(date, failedLastDate);
      failed++;
    }

    public void addIncomplete(Date date) {
      incompleteLastDate = getLatest(date, incompleteLastDate);
      incomplete++;
    }
    
    public long getUnanswered() {
      return unanswered;
    }

    public long getAnswered() {
      return answered;
    }

    public Date getAnsweredLastDate() {
      return answeredLastDate;
    }

    public long getSubmitted() {
      return submitted;
    }

    public Date getSubmittedLastDate() {
      return submittedLastDate;
    }
    
    public long getFailed() {
      return failed;
    }
    
    public Date getFailedLastDate() {
      return failedLastDate;
    }
    
    public long getPassed() {
      return passed;
    }
    
    public Date getPassedLastDate() {
      return passedLastDate;
    }

    public long getWithdrawn() {
      return withdrawn;
    }
    
    public Date getWithdrawnLastDate() {
      return withdrawnLastDate;
    }

    public long getIncomplete() {
      return incomplete;
    }
    
    public Date getIncompleteLastDate() {
      return incompleteLastDate;
    }

    private long unanswered = 0;
    private long answered = 0;
    private Date answeredLastDate = null;
    private long submitted = 0;
    private Date submittedLastDate = null;
    private long withdrawn = 0;
    private Date withdrawnLastDate = null;
    private long failed = 0;
    private Date failedLastDate = null; 
    private long passed = 0;
    private Date passedLastDate = null;
    private long incomplete = 0;
    private Date incompleteLastDate = null;
  }
  
  public static class Exercises {

    public void addUnanswered() {
      unanswered++;
    }
    
    public void addAnswered(Date date) {
      answeredLastDate = getLatest(date, answeredLastDate);
      answered++;
    }
    
    public long getUnanswered() {
      return unanswered;
    }

    public long getAnswered() {
      return answered;
    }

    public Date getAnsweredLastDate() {
      return answeredLastDate;
    }

    private long unanswered = 0;
    private long answered = 0;
    private Date answeredLastDate = null;
  }

  private static Date getLatest(Date... dates) {
    Date result = null;
    for (Date date : dates) {
      if (result == null || (date != null && date.after(result))) {
        result = date;
      }
    }
    return result;
  }
  
}