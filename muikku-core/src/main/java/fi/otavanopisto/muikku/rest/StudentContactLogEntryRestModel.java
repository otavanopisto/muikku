package fi.otavanopisto.muikku.rest;

import java.time.OffsetDateTime;

public class StudentContactLogEntryRestModel {

  public StudentContactLogEntryRestModel() {
    super();
  }

  public StudentContactLogEntryRestModel(Long id, String text, String creatorName, OffsetDateTime entryDate, StudentContactLogEntryType type, Boolean archived) {
    super();
    this.id = id;
    this.text = text;
    this.creatorName = creatorName;
    this.entryDate = entryDate;
    this.type = type;
    this.archived = archived;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public String getCreatorName() {
    return creatorName;
  }

  public void setCreatorName(String creatorName) {
    this.creatorName = creatorName;
  }

  public OffsetDateTime getEntryDate() {
    return entryDate;
  }

  public void setEntryDate(OffsetDateTime entryDate) {
    this.entryDate = entryDate;
  }

  public StudentContactLogEntryType getType() {
    return type;
  }

  public void setType(StudentContactLogEntryType type) {
    this.type = type;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  private Long id;
  private String text;
  private String creatorName;
  private OffsetDateTime entryDate;
  private StudentContactLogEntryType type;
  private Boolean archived;
}