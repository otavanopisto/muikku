package fi.otavanopisto.muikku.rest.model;

public class StudentFlag {
  
  public StudentFlag() {
  }

  public StudentFlag(Long id, Long flagId, String studentIdentifier) {
    super();
    this.id = id;
    this.studentIdentifier = studentIdentifier;
    this.flagId = flagId;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  public Long getFlagId() {
    return flagId;
  }
  
  public void setFlagId(Long flagId) {
    this.flagId = flagId;
  }

  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  private Long id;
  private Long flagId;
  private String studentIdentifier;
}
