package fi.muikku.plugins.schooldatalocal.entities;

import org.joda.time.DateTime;

import fi.muikku.plugins.schooldatalocal.LocalUserSchoolDataController;
import fi.muikku.schooldata.entity.AbstractUser;
import fi.muikku.schooldata.entity.User;

public class LocalUserImpl  extends AbstractUser implements User {

  public LocalUserImpl(String identifier, String firstName, String lastName, String displayName,
      String studyProgrammeName, String nationality, String language, String municipality, String school,
      DateTime studyStartDate, DateTime studyEndDate, DateTime studyTimeEnd) {
    super(identifier, firstName, lastName, displayName, studyProgrammeName, nationality, language, municipality, school,
        studyStartDate, studyEndDate, studyTimeEnd, false, false, false, false, false);
  }

  @Override
  public String getSchoolDataSource() {
    return LocalUserSchoolDataController.SCHOOL_DATA_SOURCE;
  }

}
