package fi.otavanopisto.muikku.atests;

public class FlagShare {
  
  public FlagShare() {
  }

  public FlagShare(Long id, Long flagId, String userIdentifier) {
    super();
    this.id = id;
    this.userIdentifier = userIdentifier;
    this.flagId = flagId;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  public Long getFlagId() {
    return flagId;
  }
  
  public void setFlagId(Long flagId) {
    this.flagId = flagId;
  }

  public String getUserIdentifier() {
    return userIdentifier;
  }
  
  public void setUserIdentifier(String userIdentifier) {
    this.userIdentifier = userIdentifier;
  }
  
  private Long id;
  private Long flagId;
  private String userIdentifier;
}
