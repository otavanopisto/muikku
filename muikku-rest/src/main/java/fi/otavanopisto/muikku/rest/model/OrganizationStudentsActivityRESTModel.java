package fi.otavanopisto.muikku.rest.model;

public class OrganizationStudentsActivityRESTModel {
  
  public OrganizationStudentsActivityRESTModel() {
  }
  
  public OrganizationStudentsActivityRESTModel(long activeStudents, long inactiveStudents) {
    this.activeStudents = activeStudents;
    this.inactiveStudents = inactiveStudents;
  }

  public long getActiveStudents() {
    return activeStudents;
  }

  public void setActiveStudents(long activeStudents) {
    this.activeStudents = activeStudents;
  }

  public long getInactiveStudents() {
    return inactiveStudents;
  }

  public void setInactiveStudents(long inactiveStudents) {
    this.inactiveStudents = inactiveStudents;
  }

  private long activeStudents;
  private long inactiveStudents;

}
