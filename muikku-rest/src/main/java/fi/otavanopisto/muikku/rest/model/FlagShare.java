package fi.otavanopisto.muikku.rest.model;

public class FlagShare {
  
  public FlagShare() {
  }

  public FlagShare(Long id, Long flagId, String userIdentifier, StaffMemberBasicInfo user) {
    super();
    this.id = id;
    this.userIdentifier = userIdentifier;
    this.flagId = flagId;
    this.user = user;
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
  
  public StaffMemberBasicInfo getUser() {
    return user;
  }

  public void setUser(StaffMemberBasicInfo user) {
    this.user = user;
  }

  private Long id;
  private Long flagId;
  private String userIdentifier;
  private StaffMemberBasicInfo user;
}
