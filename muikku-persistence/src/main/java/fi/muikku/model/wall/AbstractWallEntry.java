package fi.muikku.model.wall;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.model.util.ArchivableEntity;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public abstract class AbstractWallEntry implements ArchivableEntity {

  public Long getId() {
    return id;
  }

  public Wall getWall() {
    return wall;
  }

  public void setWall(Wall wall) {
    this.wall = wall;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public UserEntity getCreator() {
    return creator;
  }

  public void setCreator(UserEntity creator) {
    this.creator = creator;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public UserEntity getLastModifier() {
    return lastModifier;
  }

  public void setLastModifier(UserEntity lastModifier) {
    this.lastModifier = lastModifier;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  @Transient
  public List<WallEntryItem> getItems() {
    return items;
  }

  public void addItem(WallEntryItem item) {
    item.setWallEntry(this);
    items.add(item);
  }
  
  public void removeItem(WallEntryItem item) {
    if (this.equals(item.getWallEntry())) {
      item.setWallEntry(null);
      items.remove(item);
    }
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private Wall wall;
  
  @OneToMany
  @JoinColumn (name = "wallEntry_id")
  private List<WallEntryItem> items = new ArrayList<WallEntryItem>();

  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;

  @ManyToOne 
  private UserEntity creator;
  
  @NotNull
  @Column (updatable=false, nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date created;
  
  @ManyToOne  
  private UserEntity lastModifier;
  
  @NotNull
  @Column (nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date lastModified;
}
