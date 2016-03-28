package fi.otavanopisto.muikku.plugins.calendar.rest.model;

public class Calendar {
  
  public Calendar() {
  }

  public Calendar(Long id, boolean writable, boolean visible, String summary, String description) {
    this.id = id;
    this.writable = writable;
    this.visible = visible;
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
  
  public boolean isVisible() {
    return visible;
  }

  private Long id;
  private String summary;
  private String description;
  private boolean writable;
  private boolean visible;
}
