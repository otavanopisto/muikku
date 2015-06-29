package fi.muikku.plugins.schooldatapyramus.entities;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.entity.UserGroup;

public class PyramusUserGroup implements UserGroup {

  public PyramusUserGroup(String identifier, String name){
    this.identifier = identifier;
    this.name = name;
  }
  
  @Override
  public String getSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

  @Override
  public String getIdentifier() {
    return identifier;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public String getSearchId() {
    return getIdentifier() + "/" + getSchoolDataSource();
  }
  
  private String identifier;
  private String name;
}
