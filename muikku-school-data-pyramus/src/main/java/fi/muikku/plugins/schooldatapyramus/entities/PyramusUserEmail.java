package fi.muikku.plugins.schooldatapyramus.entities;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.entity.AbstractUserEmail;

public class PyramusUserEmail extends AbstractUserEmail {

  public PyramusUserEmail(SchoolDataIdentifier identifier, SchoolDataIdentifier userIdentifier, String address,
      String type, Boolean defaultAddress) {
    super(identifier, userIdentifier, address, type, defaultAddress);
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }
  
}
