package fi.otavanopisto.muikku.plugins.schooldatalocal.entities;

import java.time.OffsetDateTime;
import java.util.Set;

import fi.otavanopisto.muikku.plugins.schooldatalocal.LocalUserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.AbstractUser;
import fi.otavanopisto.muikku.schooldata.entity.User;

public class LocalUserImpl  extends AbstractUser implements User {

  public LocalUserImpl(String identifier, String firstName, String lastName, String nickName, String displayName,
      String studyProgrammeName, String studyProgrammeEducationType, SchoolDataIdentifier studyProgrammeIdentifier, String nationality, String language, String municipality, String school,
      OffsetDateTime studyStartDate, OffsetDateTime studyEndDate, OffsetDateTime studyTimeEnd, String curriculumIdentifier, SchoolDataIdentifier organizationIdentifier, boolean matriculationEligibility,
      Set<SchoolDataIdentifier> studyProgrammeIdentifiers) {
    super(identifier, firstName, lastName, nickName, displayName, studyProgrammeName, studyProgrammeEducationType, studyProgrammeIdentifier, nationality, language, municipality, school,
        studyStartDate, studyEndDate, studyTimeEnd, false, false, curriculumIdentifier, organizationIdentifier, matriculationEligibility, studyProgrammeIdentifiers);
  }

  @Override
  public String getSchoolDataSource() {
    return LocalUserSchoolDataController.SCHOOL_DATA_SOURCE;
  }

}
