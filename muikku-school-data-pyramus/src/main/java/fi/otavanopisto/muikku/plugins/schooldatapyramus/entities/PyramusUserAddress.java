package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.AbstractUserAddress;

public class PyramusUserAddress extends AbstractUserAddress {
  
  public PyramusUserAddress(SchoolDataIdentifier identifier, SchoolDataIdentifier userIdentifier, String street, String postalCode, String city, String region, String country, Boolean defaultAddress) {
    super(identifier, userIdentifier, street, postalCode, city, region, country, defaultAddress);
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

}
