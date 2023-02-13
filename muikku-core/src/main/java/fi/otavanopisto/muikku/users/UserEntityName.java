package fi.otavanopisto.muikku.users;

public class UserEntityName {
  
  public UserEntityName(String firstName, String lastName, String nickName, String studyProgrammeName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.studyProgrammeName = studyProgrammeName;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getLastName() {
    return lastName;
  }
  
  public String getDisplayName() {
    if (firstName == null || lastName == null) {
      return firstName != null ? firstName : lastName;
    }
    return String.format("%s %s", firstName, lastName);
  }
  
  public String getDisplayNameWithLine() {
    return studyProgrammeName == null ? getDisplayName() : String.format("%s %s (%s)", firstName, lastName, studyProgrammeName);
  }

  public String getNickName() {
    return nickName;
  }

  public void setNickName(String nickName) {
    this.nickName = nickName;
  }

  public String getStudyProgrammeName() {
    return studyProgrammeName;
  }

  public void setStudyProgrammeName(String studyProgrammeName) {
    this.studyProgrammeName = studyProgrammeName;
  }

  private String firstName;
  private String lastName;
  private String nickName;
  private String studyProgrammeName;
}
