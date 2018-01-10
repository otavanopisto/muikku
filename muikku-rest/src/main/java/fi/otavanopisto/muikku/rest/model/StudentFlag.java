package fi.otavanopisto.muikku.rest.model;

public class StudentFlag {
  
  public StudentFlag() {
  }

  public StudentFlag(Long id, Long flagId, String flagName, String flagColor, String studentIdentifier) {
    super();
    this.id = id;
    this.studentIdentifier = studentIdentifier;
    this.flagId = flagId;
    this.flagName = flagName;
    this.flagColor = flagColor;
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

  public String getFlagName() {
	return flagName;
  }

  public void setFlagName(String flagName) {
	this.flagName = flagName;
  }

  public String getFlagColor() {
	return flagColor;
  }

  public void setFlagColor(String flagColor) {
	this.flagColor = flagColor;
  }

  private Long id;
  private Long flagId;
  private String flagName;
  private String flagColor;
  private String studentIdentifier;
}
