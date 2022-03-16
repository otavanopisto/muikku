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

  private Long id;
  private Long entry;
  private String text;
  private String creatorName;
  private Date commentDate;
}