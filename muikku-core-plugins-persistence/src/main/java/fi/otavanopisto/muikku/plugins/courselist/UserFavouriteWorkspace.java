package fi.otavanopisto.muikku.plugins.courselist;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class UserFavouriteWorkspace {

  public Long getId() {
    return id;
  }

  public Long getUser() {
    return user;
  }

  public void setUser(Long user) {
    this.user = user;
  }
  
  public Long getWorkspaceEntity() {
    return workspaceEntity;
  }

  public void setWorkspaceEntity(Long workspaceEntity) {
    this.workspaceEntity = workspaceEntity;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (name = "user_id")
  private Long user;
  
  @Column (name = "workspaceentity_id")
  private Long workspaceEntity;
}
