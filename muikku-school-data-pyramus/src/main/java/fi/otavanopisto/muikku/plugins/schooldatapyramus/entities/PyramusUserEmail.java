package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.AbstractUserEmail;

public class PyramusUserEmail extends AbstractUserEmail {

  public PyramusUserEmail(SchoolDataIdentifier identifier, SchoolDataIdentifier userIdentifier, String address,
      Boolean defaultAddress) {
    super(identifier, userIdentifier, address, defaultAddress);
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }
  
}
