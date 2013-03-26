package fi.muikku.model.forum;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.util.OwnedEntity;
import fi.muikku.model.util.ResourceEntity;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public class ForumArea implements ResourceEntity, OwnedEntity {

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public ResourceRights getRights() {
    return rights;
  }

  public void setRights(ResourceRights rights) {
    this.rights = rights;
  }

  public UserEntity getOwner() {
    return owner;
  }

  public void setOwner(UserEntity owner) {
    this.owner = owner;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotEmpty
  private String name;

  @ManyToOne
  private ResourceRights rights;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
  
  @ManyToOne
  private UserEntity owner;
}
