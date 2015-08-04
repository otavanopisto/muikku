package fi.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;

import fi.muikku.model.users.UserGroupEntity;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public class GroupPermission {

  /**
   * Returns internal unique id
   * 
   * @return Internal unique id
   */
  public Long getId() {
    return id;
  }

  public Permission getPermission() {
    return permission;
  }

  public void setPermission(Permission permission) {
    this.permission = permission;
  }

  public UserGroupEntity getUserGroup() {
    return userGroup;
  }

  public void setUserGroup(UserGroupEntity userGroup) {
    this.userGroup = userGroup;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private Permission permission;
  
  @ManyToOne
  private UserGroupEntity userGroup;
}
