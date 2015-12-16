package fi.muikku.plugins.guider;

import java.util.Date;

public class GuiderStudentWorkspaceActivity {

  public Evaluables getEvaluables() {
    return evaluables;
  }
  
  public Excercices getExcercices() {
    return excercices;
  }
  
  private Evaluables evaluables = new Evaluables();
  private Excercices excercices = new Excercices();
  
  public static class Evaluables {

    public void addUnanswered() {
      unanswered++;
    }
    
    public void addAnswered(Date date) {
      if (answeredLastDate == null || answeredLastDate.before(date)) {
        answeredLastDate = date;
      }
      
      answered++;
    }
    
    public void addSubmitted(Date date) {
      if (submittedLastDate == null || submittedLastDate.before(date)) {
        submittedLastDate = date;
      }
      
      submitted++;
    }
    
    public void addEvaluated(Date date) {
      if (evaluatedLastDate == null || evaluatedLastDate.before(date)) {
        evaluatedLastDate = date;
      }
      
      evaluated++;
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

    public long getEvaluated() {
      return evaluated;
    }

    public Date getEvaluatedLastDate() {
      return evaluatedLastDate;
    }
    
    public long getCount() {
      return unanswered + answered + submitted + evaluated;
    }
    
    public double getDonePercent() {
      double result = submitted + evaluated;
      result /= getCount();
      return Math.round(result * 100);
    }

    private long unanswered = 0l;
    private long answered = 0l;
    private Date answeredLastDate = null;
    private long submitted = 0l;
    private Date submittedLastDate = null;
    private long evaluated = 0l;
    private Date evaluatedLastDate = null; 
  }
  
  public static class Excercices {

    public void addUnanswered() {
      unanswered++;
    }
    
    public void addAnswered(Date date) {
      if (answeredLastDate == null || answeredLastDate.before(date)) {
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
