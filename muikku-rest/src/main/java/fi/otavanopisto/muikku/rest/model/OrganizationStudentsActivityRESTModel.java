package fi.otavanopisto.muikku.rest.model;

public class OrganizationStudentsActivityRESTModel {
  
  public OrganizationStudentsActivityRESTModel() {
  }
  
  public OrganizationStudentsActivityRESTModel(Integer activeStudents, Integer inactiveStudents) {
    this.activeStudents = activeStudents;
    this.inactiveStudents = inactiveStudents;
  }

  public Integer getActiveStudents() {
    return activeStudents;
  }

  public void setActiveStudents(Integer activeStudents) {
    this.activeStudents = activeStudents;
  }

  public Integer getInactiveStudents() {
    return inactiveStudents;
  }

  public void setInactiveStudents(Integer inactiveStudents) {
    this.inactiveStudents = inactiveStudents;
  }

  private Integer activeStudents;
  private Integer inactiveStudents;

}
