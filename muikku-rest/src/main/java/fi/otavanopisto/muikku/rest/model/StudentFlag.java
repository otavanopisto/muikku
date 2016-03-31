package fi.otavanopisto.muikku.rest.model;

public class StudentFlag {
  
  public StudentFlag() {
  }

  public StudentFlag(Long id, String studentIdentifier, String ownerIdentifier, String type) {
    super();
    this.id = id;
    this.studentIdentifier = studentIdentifier;
    this.ownerIdentifier = ownerIdentifier;
    this.type = type;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

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

  public String getOwnerIdentifier() {
    return ownerIdentifier;
  }

  public void setOwnerIdentifier(String ownerIdentifier) {
    this.ownerIdentifier = ownerIdentifier;
  }

  private Long id;
  private String studentIdentifier;
  private String ownerIdentifier;
  private String type;
}
