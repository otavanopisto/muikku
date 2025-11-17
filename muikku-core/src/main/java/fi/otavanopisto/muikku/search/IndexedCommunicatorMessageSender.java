package fi.otavanopisto.muikku.search;

import java.util.List;

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
  
  public String getNickName() {
    return nickName;
  }
  
  public void setNickName(String nickName) {
    this.nickName = nickName;
  }
  
  public Boolean getArchivedBySender() {
    return archivedBySender;
  }
  
  public void setArchivedBySender(Boolean archivedBySender) {
    this.archivedBySender = archivedBySender;
  }
  
  public List<IndexedCommunicatorMessageLabels> getLabels() {
    return labels;
  }

  public void setLabels(List<IndexedCommunicatorMessageLabels> labels) {
    this.labels = labels;
  }

  public Boolean getTrashedBySender() {
    return trashedBySender;
  }

  public void setTrashedBySender(Boolean trashedBySender) {
    this.trashedBySender = trashedBySender;
  }

  private Long userEntityId;

  private String firstName;
  
  private String lastName;
  
  private String nickName;
  
  private List<IndexedCommunicatorMessageLabels> labels;

  private Boolean trashedBySender;

  private Boolean archivedBySender;

}
