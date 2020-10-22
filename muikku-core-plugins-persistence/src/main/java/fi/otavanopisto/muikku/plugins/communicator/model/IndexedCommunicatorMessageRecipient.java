package fi.otavanopisto.muikku.plugins.communicator.model;

public class IndexedCommunicatorMessageRecipient{

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  
  private Long userEntityId;

  private String displayName;

}
