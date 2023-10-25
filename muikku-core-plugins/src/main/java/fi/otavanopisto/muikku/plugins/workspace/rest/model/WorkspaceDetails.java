package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.time.OffsetDateTime;

public class WorkspaceDetails {

  public WorkspaceDetails() {
  }

  public WorkspaceDetails(String typeId, OffsetDateTime beginDate, OffsetDateTime endDate, OffsetDateTime signupStart, OffsetDateTime signupEnd, String externalViewUrl, Long rootFolderId, Long helpFolderId, Long indexFolderId, Boolean chatEnabled) {
    super();
    this.typeId = typeId;
    this.beginDate = beginDate;
    this.endDate = endDate;
    this.signupStart = signupStart;
    this.signupEnd = signupEnd;
    this.externalViewUrl = externalViewUrl;
    this.rootFolderId = rootFolderId;
    this.helpFolderId = helpFolderId;
    this.indexFolderId = indexFolderId;
    this.chatEnabled = chatEnabled;
  }

  public String getTypeId() {
    return typeId;
  }
  
  public void setTypeId(String typeId) {
    this.typeId = typeId;
  }
  
  public String getExternalViewUrl() {
    return externalViewUrl;
  }

  public void setExternalViewUrl(String externalViewUrl) {
    this.externalViewUrl = externalViewUrl;
  }
  
  public OffsetDateTime getBeginDate() {
    return beginDate;
  }
  
  public OffsetDateTime getEndDate() {
    return endDate;
  }

  public OffsetDateTime getSignupStart() {
    return signupStart;
  }

  public OffsetDateTime getSignupEnd() {
    return signupEnd;
  }

  public Long getRootFolderId() {
    return rootFolderId;
  }

  public void setRootFolderId(Long rootFolderId) {
    this.rootFolderId = rootFolderId;
  }

  public Long getHelpFolderId() {
    return helpFolderId;
  }

  public void setHelpFolderId(Long helpFolderId) {
    this.helpFolderId = helpFolderId;
  }

  public Long getIndexFolderId() {
    return indexFolderId;
  }

  public void setIndexFolderId(Long indexFolderId) {
    this.indexFolderId = indexFolderId;
  }

  public Boolean getChatEnabled() {
    return chatEnabled;
  }

  public void setChatEnabled(Boolean chatEnabled) {
    this.chatEnabled = chatEnabled;
  }

  private String typeId;
  private String externalViewUrl;
  private OffsetDateTime beginDate;
  private OffsetDateTime endDate;
  private OffsetDateTime signupStart;
  private OffsetDateTime signupEnd;
  private Long rootFolderId;
  private Long helpFolderId;
  private Long indexFolderId;
  private Boolean chatEnabled;
}
