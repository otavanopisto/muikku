package fi.otavanopisto.muikku.plugins.hops;

public class HopsStudent {
  
  public HopsStudent(Long userEntityId, String educationTypeCode) {
    this.userEntityId = userEntityId;
    this.educationTypeCode = educationTypeCode;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getEducationTypeCode() {
    return educationTypeCode;
  }

  public void setEducationTypeCode(String educationTypeCode) {
    this.educationTypeCode = educationTypeCode;
  }

  private Long userEntityId;
  private String educationTypeCode; // studyProgramme.getCategory().getEducationType().getCode()

}
