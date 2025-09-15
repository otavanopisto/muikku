package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.AbstractUserPhoneNumber;

public class PyramusUserPhoneNumber extends AbstractUserPhoneNumber {

  public PyramusUserPhoneNumber(SchoolDataIdentifier userIdentifier, String number, Boolean defaultNumber) {
    super(userIdentifier, number, defaultNumber);
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

}
