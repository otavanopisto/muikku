package fi.otavanopisto.muikku.search;

public class IndexedCommunicatorMessageSender{

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }
  
  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }
  
  public Boolean getArchivedBySender() {
    return archivedBySender;
  }
  
  public void setArchivedBySender(Boolean archivedBySender) {
    this.archivedBySender = archivedBySender;
  }
  
  private Long userEntityId;

  private String firstName;
  
  private String lastName;
  
  private Boolean archivedBySender;

}
