package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.AbstractTransferCredit;
import fi.otavanopisto.muikku.schooldata.entity.Optionality;

public class PyramusTransferCredit extends AbstractTransferCredit {

  public PyramusTransferCredit() {
  }
  
  public PyramusTransferCredit(SchoolDataIdentifier identifier, SchoolDataIdentifier studentIdentifier, OffsetDateTime date,
      SchoolDataIdentifier gradeIdentifier, SchoolDataIdentifier gradingScaleIdentifier, String verbalAssessment, SchoolDataIdentifier assessorIdentifier,
      String courseName, Integer courseNumber, Double length, SchoolDataIdentifier lengthUnitIdentifier,
      SchoolDataIdentifier schoolIdentifier, SchoolDataIdentifier subjectIdentifier, SchoolDataIdentifier curriculumIdentifier, Optionality optionality) {
    super(identifier, studentIdentifier, date, gradeIdentifier, gradingScaleIdentifier, verbalAssessment, assessorIdentifier, courseName,
        courseNumber, length, lengthUnitIdentifier, schoolIdentifier, subjectIdentifier, curriculumIdentifier, optionality);
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

}
