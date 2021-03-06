package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.StudyProgramme;

public class PyramusStudyProgramme implements StudyProgramme {

  public PyramusStudyProgramme(SchoolDataIdentifier identifier, String name) {
    this.identifier = identifier;
    this.name = name;
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
  public String getName() {
    return name;
  }
  private SchoolDataIdentifier identifier;
  private String name;
  
}
