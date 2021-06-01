package fi.otavanopisto.muikku.rest.model;

public class OrganizationStudentsActivityRESTModel {
  
  public OrganizationStudentsActivityRESTModel() {
  }
  
  public OrganizationStudentsActivityRESTModel(Integer activeStudents, Integer inActiveStudents) {
    this.activeStudents = activeStudents;
    this.inActiveStudents = inActiveStudents;
  }

  public Integer getActiveStudents() {
    return activeStudents;
  }

  public void setActiveStudents(Integer activeStudents) {
    this.activeStudents = activeStudents;
  }

  public Integer getInActiveStudents() {
    return inActiveStudents;
  }

  public void setInActiveStudents(Integer inActiveStudents) {
    this.inActiveStudents = inActiveStudents;
  }

  private Integer activeStudents;
  private Integer inActiveStudents;

}
