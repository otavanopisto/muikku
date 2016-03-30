package fi.otavanopisto.muikku.plugins.forum.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import fi.otavanopisto.muikku.model.util.ResourceEntity;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class ForumThread extends ForumMessage implements ResourceEntity {

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Boolean getSticky() {
    return sticky;
  }

  public void setSticky(Boolean sticky) {
    this.sticky = sticky;
  }

  public Boolean getLocked() {
    return locked;
  }

  public void setLocked(Boolean locked) {
    this.locked = locked;
  }

  public Date getUpdated() {
    return updated;
  }

  public void setUpdated(Date updated) {
    this.updated = updated;
  }

  private String title;
  
  @NotNull
  @Column(nullable = false)
  private Boolean sticky = Boolean.FALSE;

  @NotNull
  @Column(nullable = false)
  private Boolean locked = Boolean.FALSE;
  
  @NotNull
  @Column (nullable=false)
  @Temporal (value=TemporalType.TIMESTAMP)
  private Date updated;
}
