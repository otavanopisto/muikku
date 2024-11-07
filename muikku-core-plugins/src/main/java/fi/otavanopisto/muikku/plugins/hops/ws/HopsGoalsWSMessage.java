package fi.otavanopisto.muikku.plugins.hops.ws;

public class HopsGoalsWSMessage {

  public String getGoals() {
    return goals;
  }

  public void setGoals(String goals) {
    this.goals = goals;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  private String goals;
  private String studentIdentifier;

}
