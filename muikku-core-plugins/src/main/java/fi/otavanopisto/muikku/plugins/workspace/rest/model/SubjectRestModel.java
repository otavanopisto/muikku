package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class SubjectRestModel {

  public SubjectRestModel() {
  }
  
  public SubjectRestModel(String identifier, String name, String code) {
    this.identifier = identifier;
    this.name = name;
    this.code = code;
  }
  
  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public String getCode() {
    return code;
  }
  
  public void setCode(String code) {
    this.code = code;
  }
  
  private String identifier;
  private String name;
  private String code;
}
