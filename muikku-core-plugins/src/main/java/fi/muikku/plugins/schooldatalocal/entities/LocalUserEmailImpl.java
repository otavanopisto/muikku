package fi.muikku.plugins.schooldatalocal.entities;

import fi.muikku.plugins.schooldatalocal.LocalUserSchoolDataController;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.entity.AbstractUserEmail;

public class LocalUserEmailImpl extends AbstractUserEmail {

  public LocalUserEmailImpl(SchoolDataIdentifier identifier, SchoolDataIdentifier userIdentifier, String address,
      String type, Boolean defaultAddress) {
    super(identifier, userIdentifier, address, type, defaultAddress);
  }

  @Override
  public String getSchoolDataSource() {
    return LocalUserSchoolDataController.SCHOOL_DATA_SOURCE;
  }


}
