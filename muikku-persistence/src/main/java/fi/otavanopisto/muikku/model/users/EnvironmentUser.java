package fi.otavanopisto.muikku.model.users;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.util.ArchivableEntity;

@Entity
public class EnvironmentUser implements ArchivableEntity {

  /**
   * Returns internal unique id
   * 
   * @return Internal unique id
   */
  public Long getId() {
    return id;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  public UserEntity getUser() {
    return user;
  }

  public EnvironmentRoleEntity getRole() {
    return role;
  }

  public void setRole(EnvironmentRoleEntity role) {
    this.role = role;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public Boolean getArchived() {
    return archived;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private UserEntity user;
  
  @ManyToOne
  private EnvironmentRoleEntity role;

  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
}
