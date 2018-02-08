package fi.otavanopisto.muikku.plugins.assessmentrequest;

import java.util.Date;

public class WorkspaceAssessmentState {
  private Date date;
  private String state;

  public static final String UNASSESSED = "unassessed";       // no request, no grade
  public static final String PENDING = "pending";             // active request, no grade
  public static final String PENDING_PASS = "pending_pass";   // active request, earlier passing grade
  public static final String PENDING_FAIL = "pending_fail";   // active request, earlier failing grade
  public static final String PASS = "pass";                   // no request, passing grade
  public static final String FAIL = "fail";                   // no request, failing grade

  public WorkspaceAssessmentState() {

  }

  public WorkspaceAssessmentState(String state) {
    setState(state);
  }

  public WorkspaceAssessmentState(String state, Date date) {
    setState(state);
    setDate(date);
  }

  public String getState() {
    return this.state;
  }

  public Date getDate() {
    return this.date;
  }

  public void setState(String state) {
    this.state = state;
  }

  public void setDate(Date date) {
    this.date = date;
  }
}