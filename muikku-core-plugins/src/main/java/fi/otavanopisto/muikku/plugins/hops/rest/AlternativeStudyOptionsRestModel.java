package fi.otavanopisto.muikku.plugins.hops.rest;

public class AlternativeStudyOptionsRestModel {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }
  
  public Boolean getFinnishAsLanguage() {
    return finnishAsLanguage;
  }
  
  public void setFinnishAsLanguage(Boolean finnishAsLanguage) {
    this.finnishAsLanguage = finnishAsLanguage;
  }
  
  public Boolean getReligionAsEthics() {
    return religionAsEthics;
  }
  
  public void setReligionAsEthics(Boolean religionAsEthics) {
    this.religionAsEthics = religionAsEthics;
  }
  
  private Long id;
  private String studentIdentifier;
  private Boolean finnishAsLanguage;
  private Boolean religionAsEthics;

}
