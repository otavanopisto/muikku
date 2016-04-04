package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.AbstractEducationType;

public class PyramusEducationType extends AbstractEducationType {

  public PyramusEducationType() {
  }
  
  public PyramusEducationType(SchoolDataIdentifier identifier, String name) {
    super(identifier, name);
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

}
