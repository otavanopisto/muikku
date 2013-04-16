package fi.muikku.plugins.wall.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import fi.muikku.model.util.ArchivableEntity;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public abstract class WallEntryItem implements ArchivableEntity {

  public Long getId() {
    return id;
  }

  public abstract WallEntryItemType getType();
  
  public AbstractWallEntry getWallEntry() {
    return wallEntry;
  }

  public void setWallEntry(AbstractWallEntry wallEntry) {
    this.wallEntry = wallEntry;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public Long getCreator() {
    return creator;
  }

  public void setCreator(Long creator) {
    this.creator = creator;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Long getLastModifier() {
    return lastModifier;
  }

  public void setLastModifier(Long lastModifier) {
    this.lastModifier = lastModifier;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "wallEntry_id", insertable=false, updatable=false)
  private AbstractWallEntry wallEntry;
  
  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
  
  @Column (name = "creator_id")
  private Long creator;
  
  @NotNull
  @Column (updatable=false, nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date created;
  
  @Column (name = "lastModifier_id")
  private Long lastModifier;
  
  @NotNull
  @Column (nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date lastModified;
}
