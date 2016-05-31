package fi.otavanopisto.muikku.plugins.announcer.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class Announcement {

  public Long getId() {
    return id;
  }

  public Long getPublisherUserEntityId() {
    return publisherUserEntityId;
  }

  public void setPublisherUserEntityId(Long sender) {
    this.publisherUserEntityId = sender;
  }

  public String getCaption() {
    return caption;
  }

  public void setCaption(String caption) {
    this.caption = caption;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Date getStartDate() {
    return startDate;
  }

  public void setStartDate(Date startDate) {
    this.startDate = startDate;
  }

  public Date getEndDate() {
    return endDate;
  }

  public void setEndDate(Date endDate) {
    this.endDate = endDate;
  }
  
  public Boolean getArchived() {
    return archived;
  }
  
  public void setArchived(Boolean archived) {
    this.archived = archived;
  }
  
  public Boolean getPubliclyVisible() {
    return publiclyVisible;
  }
  
  public void setPubliclyVisible(Boolean publiclyVisible) {
    this.publiclyVisible = publiclyVisible;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @Column (name = "publisherUserEntity_id")
  private Long publisherUserEntityId;
  
  @NotNull
  @NotEmpty
  @Column (nullable = false, length = 1024)
  private String caption;

  @NotNull
  @NotEmpty
  @Column (nullable = false)
  @Lob
  private String content;

  @NotNull
  @Column (updatable=false, nullable=false)
  @Temporal (value=TemporalType.DATE)
  private Date created;

  @NotNull
  @Column (nullable=false)
  @Temporal (value=TemporalType.DATE)
  private Date startDate;

  @NotNull
  @Column (nullable=false)
  @Temporal (value=TemporalType.DATE)
  private Date endDate;

  @Column (nullable=false)
  private Boolean archived;
  
  @Column (nullable=false)
  private Boolean publiclyVisible;
}