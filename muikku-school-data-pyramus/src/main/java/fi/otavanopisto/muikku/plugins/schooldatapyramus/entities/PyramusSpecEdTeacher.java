package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.SpecEdTeacher;

public class PyramusSpecEdTeacher implements SpecEdTeacher {
  
  public PyramusSpecEdTeacher(SchoolDataIdentifier identifier, boolean isGuidanceCouncelor) {
    this.identifier = identifier;
    this.isGuidanceCouncelor = isGuidanceCouncelor;
  }

  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public SchoolDataIdentifier getIdentifier() {
    return identifier;
  }

  @Override
  public boolean isGuidanceCouncelor() {
    return isGuidanceCouncelor;
  }
  
  private boolean isGuidanceCouncelor;
  private SchoolDataIdentifier identifier;

}
