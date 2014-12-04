package fi.muikku.plugins.dnm.service;

public class Document {

  public Document() {
  }

  public Document(Long id, String name) {
    this.id = id;
    this.name = name;
  }

  public Long getId() {
    return id;
  }
  
  public String getName() {
    return name;
  }
  
  private Long id;
  private String name;
}