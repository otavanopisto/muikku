package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import org.joda.time.DateTime;

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
                     DateTime studyStartDate,
                     DateTime studyEndDate,
                     DateTime studyTimeEnd,
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
        studyProgrammeName != null && studyProgrammeName.startsWith("Internetix/"));
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }
}
