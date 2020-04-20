package fi.otavanopisto.muikku.plugins.organizationmanagement.rest.model;

public class OrganizationManagerWorkspaceTeacher {

  public OrganizationManagerWorkspaceTeacher() {
  }

  public OrganizationManagerWorkspaceTeacher(
      String firstName,
      String lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  private String firstName;
  private String lastName;
}
