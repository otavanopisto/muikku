package fi.muikku.plugins.workspace.rest.model;

public class WorkspaceStaffMember {

  public WorkspaceStaffMember() {
  }

  public WorkspaceStaffMember(String id, String firstName, String lastName) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public String getId() {
    return id;
  }
  
  public void setId(String id) {
    this.id = id;
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

  private String id;
  private String firstName;
  private String lastName;

}