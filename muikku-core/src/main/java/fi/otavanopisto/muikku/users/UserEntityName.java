package fi.otavanopisto.muikku.users;

public class UserEntityName {
  
  public UserEntityName(String firstName, String lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getLastName() {
    return lastName;
  }
  
  public String getDisplayName() {
    return String.format("%s %s", firstName, lastName);
  }

  private String firstName;
  private String lastName;

}
