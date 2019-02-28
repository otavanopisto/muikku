package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.Date;

public class WorkspaceJournalCommentRESTModel {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getJournalEntryId() {
    return journalEntryId;
  }

  public void setJournalEntryId(Long journalEntryId) {
    this.journalEntryId = journalEntryId;
  }

  public Long getParentCommentId() {
    return parentCommentId;
  }

  public void setParentCommentId(Long parentCommentId) {
    this.parentCommentId = parentCommentId;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Long getAuthorId() {
    return authorId;
  }

  public void setAuthorId(Long authorId) {
    this.authorId = authorId;
  }

  private Long id;
  private Long journalEntryId;
  private Long parentCommentId;
  private Long authorId;
  private String firstName;
  private String lastName;
  private String comment;
  private Date created;

}
