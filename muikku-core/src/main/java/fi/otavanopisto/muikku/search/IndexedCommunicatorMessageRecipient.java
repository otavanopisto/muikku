package fi.otavanopisto.muikku.search;

import java.util.List;

public class IndexedCommunicatorMessageRecipient{

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }
  
  public Boolean getReadByReceiver() {
    return readByReceiver;
  }
  
  public void setReadByReceiver(Boolean readByReceiver) {
    this.readByReceiver = readByReceiver;
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
  
  public String getStudyProgrammeName() {
    return studyProgrammeName;
  }
  
  public void setStudyProgrammeName(String studyProgrammeName) {
    this.studyProgrammeName = studyProgrammeName;
  }
  
  public List<IndexedCommunicatorMessageLabels> getLabels(){
    return this.labels;
  }
  
  public void setLabels(List<IndexedCommunicatorMessageLabels> labels) {
    this.labels = labels;
  }
  
  public Boolean getArchivedByReceiver() {
    return archivedByReceiver;
  }
  
  public void setArchivedByReceiver(Boolean archivedByReceiver) {
    this.archivedByReceiver = archivedByReceiver;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Boolean getTrashedByReceiver() {
    return trashedByReceiver;
  }

  public void setTrashedByReceiver(Boolean trashedByReceiver) {
    this.trashedByReceiver = trashedByReceiver;
  }

  private Long id;
  private Long userEntityId;
  private String firstName;
  private String lastName;
  private String nickName;
  private Boolean readByReceiver;
  private Boolean trashedByReceiver;
  private Boolean archivedByReceiver;
  private List<IndexedCommunicatorMessageLabels> labels;
  private String studyProgrammeName;
}
