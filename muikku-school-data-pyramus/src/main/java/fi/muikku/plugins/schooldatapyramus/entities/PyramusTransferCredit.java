package fi.muikku.plugins.schooldatapyramus.entities;

import org.joda.time.DateTime;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.entity.AbstractTransferCredit;

public class PyramusTransferCredit extends AbstractTransferCredit {

  public PyramusTransferCredit() {
  }
  
  public PyramusTransferCredit(SchoolDataIdentifier identifier, SchoolDataIdentifier studentIdentifier, DateTime date,
      SchoolDataIdentifier gradeIdentifier, SchoolDataIdentifier gradingScaleIdentifier, String verbalAssessment, SchoolDataIdentifier assessorIdentifier,
      String courseName, Integer courseNumber, Double length, SchoolDataIdentifier lengthUnitIdentifier,
      SchoolDataIdentifier schoolIdentifier, SchoolDataIdentifier subjectIdentifier) {
    super(identifier, studentIdentifier, date, gradeIdentifier, gradingScaleIdentifier, verbalAssessment, assessorIdentifier, courseName,
        courseNumber, length, lengthUnitIdentifier, schoolIdentifier, subjectIdentifier);
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

}
