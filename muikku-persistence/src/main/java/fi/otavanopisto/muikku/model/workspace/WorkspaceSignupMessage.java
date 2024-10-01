package fi.otavanopisto.muikku.model.workspace;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import fi.otavanopisto.muikku.model.users.UserGroupEntity;

@Entity
public class WorkspaceSignupMessage {

  public Long getId() {
    return id;
  }
  
  public WorkspaceEntity getWorkspaceEntity() {
    return workspaceEntity;
  }

  public void setWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    this.workspaceEntity = workspaceEntity;
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

  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public List<UserGroupEntity> getUserGroupEntities() {
    return userGroupEntities;
  }

  public void setUserGroupEntities(List<UserGroupEntity> userGroupEntities) {
    this.userGroupEntities = userGroupEntities;
  }

  public boolean isDefaultMessage() {
    return defaultMessage;
  }

  public void setDefaultMessage(boolean defaultMessage) {
    this.defaultMessage = defaultMessage;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private WorkspaceEntity workspaceEntity;

  @OneToMany
  @JoinTable (name = "WorkspaceSignupMessageGroups", joinColumns = @JoinColumn(name = "workspaceSignupMessage_id"), inverseJoinColumns = @JoinColumn(name = "userGroupEntity_id"))
  private List<UserGroupEntity> userGroupEntities;

  @Column(nullable = false)
  private boolean defaultMessage;
  
  @Column(nullable = false)
  private boolean enabled;

  @NotNull
  @Column (nullable = false)
  private String caption;

  @NotNull
  @Column (nullable = false)
  @Lob
  private String content;
}
