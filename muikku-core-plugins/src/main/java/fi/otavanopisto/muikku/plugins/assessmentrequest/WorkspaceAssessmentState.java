package fi.otavanopisto.muikku.plugins.assessmentrequest;

import java.util.Date;

public class WorkspaceAssessmentState {

  public static final String UNASSESSED = "unassessed";       // no request, no grade
  public static final String PENDING = "pending";             // active request, no grade
  public static final String PENDING_PASS = "pending_pass";   // active request, earlier passing grade
  public static final String PENDING_FAIL = "pending_fail";   // active request, earlier failing grade
  public static final String PASS = "pass";                   // no request, passing grade
  public static final String FAIL = "fail";                   // no request, failing grade
  public static final String INCOMPLETE = "incomplete";       // teacher has requested changes

  public WorkspaceAssessmentState() {

  }

  public WorkspaceAssessmentState(String state) {
    this.state = state;
  }

  public WorkspaceAssessmentState(String state, Date date) {
    this.state = state;
    this.date = date;
  }

  public String getState() {
    return state;
  }

  public Date getDate() {
    return date;
  }

  public void setState(String state) {
    this.state = state;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  private Date date;
  private String state;

}