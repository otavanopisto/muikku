package fi.muikku.plugins.guider;

import java.util.Date;

public class GuiderStudentWorkspaceActivity {

  public Evaluables getEvaluables() {
    return evaluables;
  }
  
  public Excercices getExcercices() {
    return excercices;
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
  private Excercices excercices = new Excercices();
  private Date lastVisit;
  private long numVisits;
  private long journalEntryCount;
  private Date lastJournalEntry;
  
  public static class Evaluables {

    public void addUnanswered() {
      unanswered++;
    }
    
    public void addAnswered(Date date) {
      if ((date != null) && (answeredLastDate == null || answeredLastDate.before(date))) {
        answeredLastDate = date;
      }
      
      answered++;
    }
    
    public void addSubmitted(Date date) {
      if ((date != null) && (submittedLastDate == null || submittedLastDate.before(date))) {
        submittedLastDate = date;
      }
      
      submitted++;
    }
    
    public void addPassed(Date date) {
      if ((date != null) && (passedLastDate == null || passedLastDate.before(date))) {
        passedLastDate = date;
      }
      
      passed++;
    }
    
    public void addFailed(Date date) {
      if ((date != null) && (failedLastDate == null || failedLastDate.before(date))) {
        failedLastDate = date;
      }
      
      failed++;
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
    
    public long getCount() {
      return unanswered + answered + submitted + failed + passed;
    }
    
    public double getDonePercent() {
      double result = submitted + passed;
      result /= getCount();
      return Math.round(result * 100);
    }

    private long unanswered = 0l;
    private long answered = 0l;
    private Date answeredLastDate = null;
    private long submitted = 0l;
    private Date submittedLastDate = null;
    private long failed = 0l;
    private Date failedLastDate = null; 
    private long passed = 0l;
    private Date passedLastDate = null; 
  }
  
  public static class Excercices {

    public void addUnanswered() {
      unanswered++;
    }
    
    public void addAnswered(Date date) {
      if ((date != null) && (answeredLastDate == null || answeredLastDate.before(date))) {
        answeredLastDate = date;
      }
      
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
    
    public long getCount() {
      return unanswered + answered;
    }
    
    public double getDonePercent() {
      double result = answered;
      result /= getCount();
      return Math.round(result * 100);
    }

    private long unanswered = 0l;
    private long answered = 0l;
    private Date answeredLastDate = null;
  }
  
}
