package fi.otavanopisto.muikku.rest.model;

import java.util.Date;
import java.util.List;

public class GuiderStudentRestModel extends FlaggedStudentRestModel {

  public GuiderStudentRestModel() {
  }

  public GuiderStudentRestModel(String id, String firstName, String lastName, String nickName, String studyProgrammeName,
      String studyProgrammeIdentifier, Boolean hasImage, String nationality, String language, String municipality,
      String school, String email, Date studyStartDate, Date studyEndDate, Date studyTimeEnd, Date lastLogin,
      String curriculumIdentifier, boolean updatedByStudent, Long userEntityId, List<StudentFlag> flags,
      OrganizationRESTModel organization, boolean matriculationEligibility, Boolean hasPedagogyForm, String curriculumName,
      HopsStudentPermissionsRestModel permissions) {
    super(id, firstName, lastName, nickName, studyProgrammeName, studyProgrammeIdentifier, hasImage, nationality, language, municipality,
        school, email, studyStartDate, studyEndDate, studyTimeEnd, lastLogin,
        curriculumIdentifier, updatedByStudent, userEntityId, flags, organization, hasPedagogyForm);
    this.matriculationEligibility = matriculationEligibility;
    this.curriculumName = curriculumName;
    this.permissions = permissions;
  }

  public boolean getMatriculationEligibility() {
    return matriculationEligibility;
  }

  public void setMatriculationEligibility(boolean matriculationEligibility) {
    this.matriculationEligibility = matriculationEligibility;
  }

  public String getCurriculumName() {
    return curriculumName;
  }

  public void setCurriculumName(String curriculumName) {
    this.curriculumName = curriculumName;
  }

  public HopsStudentPermissionsRestModel getPermissions() {
    return permissions;
  }

  public void setPermissions(HopsStudentPermissionsRestModel permissions) {
    this.permissions = permissions;
  }

  private boolean matriculationEligibility;
  private String curriculumName;
  private HopsStudentPermissionsRestModel permissions;
}