package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.time.OffsetDateTime;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.AbstractUser;
import fi.otavanopisto.muikku.schooldata.entity.User;

public class PyramusUser extends AbstractUser implements User {

  public PyramusUser(String identifier,
                     String firstName,
                     String lastName,
                     String ssn,
                     String nickName,
                     String displayName,
                     String studyProgrammeName,
                     String nationality,
                     String language,
                     String municipality,
                     String school,
                     String curriculumIdentifier,
                     String organizationIdentifier,
                     OffsetDateTime studyStartDate,
                     OffsetDateTime studyEndDate,
                     OffsetDateTime studyTimeEnd,
                     boolean evaluationFees,
                     boolean hidden) {
    
    super(identifier, 
        firstName, 
        lastName, 
        ssn,
        nickName,
        displayName, 
        studyProgrammeName, 
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
        organizationIdentifier);
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }
}
