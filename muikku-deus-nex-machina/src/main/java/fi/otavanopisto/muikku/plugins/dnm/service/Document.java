package fi.otavanopisto.muikku.plugins.dnm.service;

public class Document {

  public Document() {
  }

  public Document(Long id, String path, Integer priority) {
    this.id = id;
    this.path = path;
    this.priority = priority;
  }

  public Long getId() {
    return id;
  }
  
  public String getPath() {
    return path;
  }
  
  public Integer getPriority() {
    return priority;
  }
  
  private Long id;
  private String path;
  private Integer priority;
}