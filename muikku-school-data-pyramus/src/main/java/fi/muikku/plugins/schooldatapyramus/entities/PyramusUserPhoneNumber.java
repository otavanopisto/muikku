package fi.muikku.plugins.schooldatapyramus.entities;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.entity.AbstractUserPhoneNumber;

public class PyramusUserPhoneNumber extends AbstractUserPhoneNumber {

  public PyramusUserPhoneNumber(SchoolDataIdentifier userIdentifier, String number, String type, Boolean defaultNumber) {
    super(userIdentifier, number, type, defaultNumber);
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

}
