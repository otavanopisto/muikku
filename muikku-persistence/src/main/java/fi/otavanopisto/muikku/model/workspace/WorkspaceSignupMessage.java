package fi.otavanopisto.muikku.model.workspace;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import fi.otavanopisto.muikku.model.users.UserGroupEntity;

@Entity
@Table (
    uniqueConstraints = {
        @UniqueConstraint (columnNames = { "workspaceEntity_id", "signupGroupEntity_id" })
    }
)
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

  public UserGroupEntity getSignupGroupEntity() {
    return signupGroupEntity;
  }

  public void setSignupGroupEntity(UserGroupEntity signupGroupEntity) {
    this.signupGroupEntity = signupGroupEntity;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private WorkspaceEntity workspaceEntity;

  @ManyToOne
  private UserGroupEntity signupGroupEntity;
  
  @Column(nullable = false)
  private boolean enabled;

  @NotNull
  @NotEmpty
  @Column (nullable = false)
  private String caption;

  @NotNull
  @NotEmpty
  @Column (nullable = false)
  @Lob
  private String content;
}
