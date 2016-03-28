package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.entity.GroupUser;

public class PyramusGroupUser implements GroupUser {

  public PyramusGroupUser(String identifier, String userIdentifier/*, String groupIdentifier*/){
    this.identifier = identifier;
    this.userIdentifier = userIdentifier;
    //this.groupIdentifier = groupIdentifier;
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
  public String getUserIdentifier() {
    return userIdentifier;
  }

  @Override
  public String getUserSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }

 /* @Override
  public String getGroupIdentifier() {
    return groupIdentifier;
  }

  @Override
  public String getGroupSchoolDataSource() {
    return SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE;
  }*/

  private String identifier;
  private String userIdentifier;
  //private String groupIdentifier;
  
  
}
