package fi.muikku.plugins.schooldatapyramus.entities;

import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.entity.UserRole;

public class PyramusUserRole implements UserRole {

  public PyramusUserRole(String identifier, String userIdentifier, String roleIdentifier) {
    super();
    this.identifier = identifier;
    this.userIdentifier = userIdentifier;
    this.roleIdentifier = roleIdentifier;
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
  public String getRoleIdentifier() {
    return roleIdentifier;
  }

  private String identifier;
  private String userIdentifier;
  private String roleIdentifier;
}
