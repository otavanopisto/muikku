package fi.otavanopisto.muikku.plugins.wall.rest.model;

import java.util.Date;

public abstract class AbstractWallEntry {
  
  public AbstractWallEntry() {
  }
  
  public AbstractWallEntry(Long id, Long wallId, String text, Boolean archived, Long creatorId, Date created, Long lastModifierId, Date lastModified) {
    super();
    this.id = id;
    this.wallId = wallId;
    this.text = text;
    this.archived = archived;
    this.creatorId = creatorId;
    this.created = created;
    this.lastModifierId = lastModifierId;
    this.lastModified = lastModified;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getWallId() {
    return wallId;
  }

  public void setWallId(Long wallId) {
    this.wallId = wallId;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  public Long getCreatorId() {
    return creatorId;
  }

  public void setCreatorId(Long creatorId) {
    this.creatorId = creatorId;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Long getLastModifierId() {
    return lastModifierId;
  }

  public void setLastModifierId(Long lastModifierId) {
    this.lastModifierId = lastModifierId;
  }

  public Date getLastModified() {
    return lastModified;
  }

  public void setLastModified(Date lastModified) {
    this.lastModified = lastModified;
  }

  private Long id;
  private Long wallId;
  private String text;
  private Boolean archived;
  private Long creatorId;
  private Date created;
  private Long lastModifierId;
  private Date lastModified;
}
