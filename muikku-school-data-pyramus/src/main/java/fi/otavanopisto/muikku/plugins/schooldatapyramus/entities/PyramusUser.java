package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.time.OffsetDateTime;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.AbstractUser;
import fi.otavanopisto.muikku.schooldata.entity.User;

public class PyramusUser extends AbstractUser implements User {

  public PyramusUser(String identifier,
                     String firstName,
                     String lastName,
                     String displayName,
                     String studyProgrammeName,
                     String nationality,
                     String language,
                     String municipality,
                     String school,
                     String curriculumIdentifier,
                     OffsetDateTime studyStartDate,
                     OffsetDateTime studyEndDate,
                     OffsetDateTime studyTimeEnd,
                     boolean hidden,
                     boolean startedStudies, 
                     boolean finishedStudies, 
                     boolean active) {
    
    super(identifier, 
        firstName, 
        lastName, 
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
        startedStudies,
        finishedStudies,
        active,
        studyProgrammeName != null && studyProgrammeName.startsWith("Internetix/"),
        curriculumIdentifier);
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }
}
