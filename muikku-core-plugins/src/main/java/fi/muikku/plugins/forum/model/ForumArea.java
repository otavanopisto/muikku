package fi.muikku.plugins.forum.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

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

  public Long getRights() {
    return rights;
  }

  public void setRights(Long rights) {
    this.rights = rights;
  }

  public Long getOwner() {
    return owner;
  }

  public void setOwner(Long owner) {
    this.owner = owner;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotEmpty
  private String name;

  @Column (name = "rights_id")
  private Long rights;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
  
  @Column (name = "owner_id")
  private Long owner;
}
