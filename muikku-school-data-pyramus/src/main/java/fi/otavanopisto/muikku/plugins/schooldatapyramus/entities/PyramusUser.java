package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.time.OffsetDateTime;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.AbstractUser;
import fi.otavanopisto.muikku.schooldata.entity.User;

public class PyramusUser extends AbstractUser implements User {

  public PyramusUser(String identifier,
                     String firstName,
                     String lastName,
                     String nickName,
                     String displayName,
                     String studyProgrammeName,
                     String studyProgrammeEducationType,
                     SchoolDataIdentifier studyProgrammeIdentifier,
                     String nationality,
                     String language,
                     String municipality,
                     String school,
                     SchoolDataIdentifier curriculumIdentifier,
                     SchoolDataIdentifier organizationIdentifier,
                     OffsetDateTime studyStartDate,
                     OffsetDateTime studyEndDate,
                     OffsetDateTime studyTimeEnd,
                     boolean evaluationFees,
                     boolean hidden,
                     boolean matriculationEligibility) {
    
    super(identifier, 
        firstName, 
        lastName, 
        nickName,
        displayName, 
        studyProgrammeName, 
        studyProgrammeEducationType,
        studyProgrammeIdentifier,
        nationality, 
        language, 
        municipality, 
        school, 
        studyStartDate, 
        studyEndDate, 
        studyTimeEnd, 
        hidden, 
        evaluationFees,
        curriculumIdentifier,
        organizationIdentifier,
        matriculationEligibility);
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }
}
