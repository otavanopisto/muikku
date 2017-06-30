package fi.otavanopisto.muikku.plugins.transcriptofrecords;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.transcriptofrecords.dao.StudiesViewCourseChoiceDAO;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.StudiesViewCourseChoice;

public class StudiesViewCourseChoiceController {
  
  @Inject
  StudiesViewCourseChoiceDAO studiesViewCourseChoiceDAO;
  
  public StudiesViewCourseChoice create(
      String subjectSchoolDataIdentifier,
      int courseNumber,
      String studentSchoolDataIdentifier
  ) {
    return studiesViewCourseChoiceDAO.create(
        subjectSchoolDataIdentifier,
        courseNumber,
        studentSchoolDataIdentifier
    );
  }
  
  public StudiesViewCourseChoice find(
      String subjectSchoolDataIdentifier,
      int courseNumber,
      String studentSchoolDataIdentifier
  ) {
    return studiesViewCourseChoiceDAO.find(
        subjectSchoolDataIdentifier,
        courseNumber,
        studentSchoolDataIdentifier
    );
  }
  
  public void delete(StudiesViewCourseChoice e) {
    studiesViewCourseChoiceDAO.delete(e);
  }
}
