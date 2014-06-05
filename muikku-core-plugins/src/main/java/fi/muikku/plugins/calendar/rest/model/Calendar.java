package fi.muikku.plugins.calendar.rest.model;

public class Calendar {
  
  public Calendar() {
  }

  public Calendar(Long id, boolean writable, String summary, String description) {
    this.id = id;
    this.writable = writable;
    this.summary = summary;
    this.description = description;
  }
  
  public Long getId() {
    return id;
  }
  
  public void setId(Long id) {
    this.id = id;
  }
  
  public String getSummary() {
    return summary;
  }
  
  public void setSummary(String summary) {
    this.summary = summary;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
  
  public boolean isWritable() {
    return writable;
  }

  private Long id;
  private String summary;
  private String description;
  private boolean writable;
}
