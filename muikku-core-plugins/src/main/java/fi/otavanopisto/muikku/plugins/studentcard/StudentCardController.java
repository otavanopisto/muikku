package fi.otavanopisto.muikku.plugins.studentcard;

import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.StudentCard;
import fi.otavanopisto.muikku.schooldata.payload.StudentCardRESTModel;

public class StudentCardController {

  @Inject
  private UserSchoolDataController userSchoolDataController;

  public StudentCard getStudentCard(SchoolDataIdentifier studentIdentifier) {
    return userSchoolDataController.getStudentCard(studentIdentifier);
  }

  public BridgeResponse<StudentCard> updateActive(SchoolDataIdentifier studentIdentifier, StudentCardRESTModel studentCard, Boolean active) {
    return userSchoolDataController.updateActive(studentIdentifier, studentCard, active);
  }
}
