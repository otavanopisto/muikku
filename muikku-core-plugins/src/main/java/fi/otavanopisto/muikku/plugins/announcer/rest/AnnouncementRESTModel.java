package fi.otavanopisto.muikku.plugins.announcer.rest;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceBasicInfo;

public class AnnouncementRESTModel {
  
  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getPublisherUserEntityId() {
    return publisherUserEntityId;
  }

  public void setPublisherUserEntityId(Long publisherUserEntityId) {
    this.publisherUserEntityId = publisherUserEntityId;
  }

  public String getCaption() {
    return caption;
  }

  public void setCaption(String caption) {
    this.caption = caption;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Date getStartDate() {
    return startDate;
  }

  public void setStartDate(Date startDate) {
    this.startDate = startDate;
  }

  public Date getEndDate() {
    return endDate;
  }

  public void setEndDate(Date endDate) {
    this.endDate = endDate;
  }

  public Boolean isArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public List<Long> getUserGroupEntityIds() {
    return userGroupEntityIds;
  }

  public void setUserGroupEntityIds(List<Long> userGroupEntityIds) {
    this.userGroupEntityIds = userGroupEntityIds;
  }

  public List<Long> getWorkspaceEntityIds() {
    return workspaceEntityIds;
  }

  public void setWorkspaceEntityIds(List<Long> workspaceEntityIds) {
    this.workspaceEntityIds = workspaceEntityIds;
  }

  public Boolean getPubliclyVisible() {
    return publiclyVisible;
  }

  public void setPubliclyVisible(Boolean publiclyVisible) {
    this.publiclyVisible = publiclyVisible;
  }
  
  public AnnouncementTemporalStatus getTemporalStatus() {
    return temporalStatus;
  }

  public void setTemporalStatus(AnnouncementTemporalStatus temporalStatus) {
    this.temporalStatus = temporalStatus;
  }

  public boolean isUnread() {
    return unread;
  }

  public void setUnread(boolean unread) {
    this.unread = unread;
  }

  public boolean isPinned() {
    return pinned;
  }

  public void setPinned(boolean pinned) {
    this.pinned = pinned;
  }

  public boolean isPinnedByLoggedUser() {
    return pinnedByLoggedUser;
  }

  public void setPinnedByLoggedUser(boolean pinnedByLoggedUser) {
    this.pinnedByLoggedUser = pinnedByLoggedUser;
  }

  public List<WorkspaceBasicInfo> getWorkspaces() {
    return workspaces;
  }

  public void setWorkspaces(List<WorkspaceBasicInfo> workspaces) {
    this.workspaces = workspaces;
  }

  public List<AnnouncementCategoryRESTModel> getCategories() {
    return categories;
  }

  public void setCategories(List<AnnouncementCategoryRESTModel> categories) {
    this.categories = categories;
  }

  private Long id;
  private Long publisherUserEntityId;
  private String caption;
  private String content;
  private Date created;
  private Date startDate;
  private Date endDate;
  private Boolean archived;
  private List<Long> userGroupEntityIds;
  private List<Long> workspaceEntityIds;
  private Boolean publiclyVisible;
  private AnnouncementTemporalStatus temporalStatus;
  private boolean unread;
  private boolean pinned;
  private boolean pinnedByLoggedUser;
  private List<WorkspaceBasicInfo> workspaces;
  private List<AnnouncementCategoryRESTModel> categories;
}
