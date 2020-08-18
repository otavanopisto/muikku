package fi.otavanopisto.muikku.rest.model;

public class StudyProgramme {
  
  public StudyProgramme() {
  }

  public StudyProgramme(String identifier, String name) {
    this.identifier = identifier;
    this.name = name;
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

  private String identifier;
  private String name;
  
}
