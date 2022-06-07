package fi.otavanopisto.muikku.rest;

import java.util.Date;

public class StudentContactLogEntryCommentRestModel{

  public Long getId() {
    return id;
  }
  public void setText(String text) {
    this.text = text;
  }
  
  public String getText() {
    return text;
  }

  public Long getCreatorId() {
    return creatorId;
  }
  public void setCreatorId(Long creatorId) {
    this.creatorId = creatorId;
  }
  public void setCommentDate(Date commentDate) {
    this.commentDate = commentDate;
  }

  public Date getCommentDate() {
    return commentDate;
  }

  public void setCreatorName(String creator) {
    this.creatorName = creator;
  }

  public String getCreatorName() {
    return creatorName;
  }

  public void setEntry(Long entry) {
    this.entry = entry;
  }

  public Long getEntry() {
    return entry;
  }

  public Boolean getHasImage() {
    return hasImage;
  }
  public void setHasImage(Boolean hasImage) {
    this.hasImage = hasImage;
  }

  private Long id;
  private Long entry;
  private String text;
  private Long creatorId;
  private String creatorName;
  private Date commentDate;
  private Boolean hasImage;
}