package fi.otavanopisto.muikku.plugins.forum.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.util.ArchivableEntity;
import fi.otavanopisto.muikku.model.util.OwnedEntity;
import fi.otavanopisto.muikku.model.util.ResourceEntity;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public class ForumArea implements ResourceEntity, OwnedEntity, ArchivableEntity {

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

  public ForumAreaGroup getGroup() {
    return group;
  }

  public void setGroup(ForumAreaGroup group) {
    this.group = group;
  }

  public Long getVersion() {
    return version;
  }

  public void setVersion(Long version) {
    this.version = version;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotEmpty
  private String name;

  @ManyToOne
  private ForumAreaGroup group;
  
  @Column (name = "rights_id")
  private Long rights;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived;
  
  @Column (name = "owner_id")
  private Long owner;
  
  @Version
  @Column(nullable = false)
  private Long version;
}
