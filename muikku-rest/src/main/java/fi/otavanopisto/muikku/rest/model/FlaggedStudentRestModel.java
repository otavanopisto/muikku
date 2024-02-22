package fi.otavanopisto.muikku.rest.model;

import java.util.Date;
import java.util.List;

public class FlaggedStudentRestModel extends Student {

  public FlaggedStudentRestModel() {
  }

  public FlaggedStudentRestModel(String id, String firstName, String lastName, String nickName, String studyProgrammeName,
      String studyProgrammeIdentifier, Boolean hasImage, String nationality, String language, String municipality,
      String school, String email, Date studyStartDate, Date studyEndDate, Date studyTimeEnd, Date lastLogin,
      String curriculumIdentifier, boolean updatedByStudent, Long userEntityId, List<StudentFlag> flags,
      OrganizationRESTModel organization, Boolean hasPedagogyForm) {
    super(id, firstName, lastName, nickName, studyProgrammeName, studyProgrammeIdentifier, hasImage, nationality, language, municipality,
        school, email, studyStartDate, studyEndDate, studyTimeEnd, lastLogin,
        curriculumIdentifier, updatedByStudent, userEntityId, organization, hasPedagogyForm);
    this.flags = flags;
  }
   
  public List<StudentFlag> getFlags() {
    return flags;
  }

  public void setFlags(List<StudentFlag> flags) {
    this.flags = flags;
  }

  private List<StudentFlag> flags;
}
