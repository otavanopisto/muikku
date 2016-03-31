package fi.otavanopisto.muikku.plugins.schooldatalocal.entities;

import fi.otavanopisto.muikku.plugins.schooldatalocal.LocalUserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.AbstractUserEmail;

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
