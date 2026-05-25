package fi.otavanopisto.muikku.rest.model;

import java.util.Date;
import java.util.List;

public class GuiderStudentRestModel extends FlaggedStudentRestModel {

  public GuiderStudentRestModel() {
  }

  public GuiderStudentRestModel(String id, String firstName, String lastName, String nickName, String studyProgrammeName,
      String studyProgrammeIdentifier, String educationTypeCode, Boolean hasImage, String nationality, String language, String municipality,
      String school, String email, Date studyStartDate, Date studyEndDate, Date studyTimeEnd, Date lastLogin,
      String curriculumIdentifier, boolean updatedByStudent, Long userEntityId, List<StudentFlag> flags,
      OrganizationRESTModel organization, boolean matriculationEligibility, Boolean hasPedagogyForm, boolean under18, boolean u18compulsory,
      String curriculumName, HopsStudentPermissionsRestModel permissions, List<GuidanceCounselorRestModel> guidanceCounselors) {
    super(id, firstName, lastName, nickName, studyProgrammeName, studyProgrammeIdentifier, educationTypeCode, hasImage, nationality,
        language, municipality, school, email, studyStartDate, studyEndDate, studyTimeEnd, lastLogin,
        curriculumIdentifier, curriculumName, updatedByStudent, userEntityId, flags, organization, hasPedagogyForm, u18compulsory);
    this.under18 = under18;
    this.matriculationEligibility = matriculationEligibility;
    this.permissions = permissions;
    this.guidanceCounselors = guidanceCounselors;
  }

  public boolean getMatriculationEligibility() {
    return matriculationEligibility;
  }

  public void setMatriculationEligibility(boolean matriculationEligibility) {
    this.matriculationEligibility = matriculationEligibility;
  }

  public HopsStudentPermissionsRestModel getPermissions() {
    return permissions;
  }

  public void setPermissions(HopsStudentPermissionsRestModel permissions) {
    this.permissions = permissions;
  }

  public List<GuidanceCounselorRestModel> getGuidanceCounselors() {
    return guidanceCounselors;
  }

  public void setGuidanceCounselors(List<GuidanceCounselorRestModel> guidanceCounselors) {
    this.guidanceCounselors = guidanceCounselors;
  }

  public boolean isUnder18() {
    return under18;
  }

  public void setUnder18(boolean under18) {
    this.under18 = under18;
  }

  private boolean matriculationEligibility;
  private HopsStudentPermissionsRestModel permissions;
  private List<GuidanceCounselorRestModel> guidanceCounselors;
  private boolean under18;
}