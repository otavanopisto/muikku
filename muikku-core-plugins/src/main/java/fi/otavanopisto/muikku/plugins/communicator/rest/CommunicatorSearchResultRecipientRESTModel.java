package fi.otavanopisto.muikku.plugins.communicator.rest;

/**
 * REST model for message recipient in search.
 */
public class CommunicatorSearchResultRecipientRESTModel {

  public CommunicatorSearchResultRecipientRESTModel() {
  }
  
  public CommunicatorSearchResultRecipientRESTModel(Long userEntityId, String displayName) {
    this.userEntityId = userEntityId;
    this.displayName = displayName;
  }

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
