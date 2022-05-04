package fi.otavanopisto.muikku.rest.model;

import java.util.Date;
import java.util.List;

public class GuiderStudentRestModel extends Student {

  public GuiderStudentRestModel() {
  }

  public GuiderStudentRestModel(String id, String firstName, String lastName, String nickName, String studyProgrammeName,
      String studyProgrammeIdentifier, Boolean hasImage, String nationality, String language, String municipality,
      String school, String email, Date studyStartDate, Date studyEndDate, Date studyTimeEnd, Date lastLogin,
      String curriculumIdentifier, boolean updatedByStudent, Long userEntityId, List<StudentFlag> flags,
      OrganizationRESTModel organization, boolean isUpperSecondarySchoolCurriculum) {
    super();
    this.isUpperSecondarySchoolCurriculum = isUpperSecondarySchoolCurriculum;
  }
   
  public boolean getIsUpperSecondarySchoolCurriculum() {
    return isUpperSecondarySchoolCurriculum;
  }

  public void setIsUpperSecondarySchoolCurriculum(boolean isUpperSecondarySchoolCurriculum) {
    this.isUpperSecondarySchoolCurriculum = isUpperSecondarySchoolCurriculum;
  }
  private boolean isUpperSecondarySchoolCurriculum;
}
