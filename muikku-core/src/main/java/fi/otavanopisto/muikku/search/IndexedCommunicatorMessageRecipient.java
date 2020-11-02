package fi.otavanopisto.muikku.search;

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

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  
  private Long userEntityId;

  private String displayName;

  private Boolean readByReceiver;
}
