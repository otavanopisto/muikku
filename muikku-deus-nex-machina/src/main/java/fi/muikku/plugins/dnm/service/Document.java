package fi.muikku.plugins.dnm.service;

public class Document {

  public Document() {
  }

  public Document(Long id, String path) {
    this.id = id;
    this.path = path;
  }

  public Long getId() {
    return id;
  }
  
  public String getPath() {
    return path;
  }
  
  private Long id;
  private String path;
}