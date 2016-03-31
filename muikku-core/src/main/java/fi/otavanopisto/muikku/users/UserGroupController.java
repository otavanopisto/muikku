package fi.otavanopisto.muikku.users;

import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.base.SchoolDataSourceDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;

public class UserGroupController {

  @Inject
  private SchoolDataSourceDAO schoolDataSourceDAO;
  
  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  public UserGroup findUserGroup(String dataSource, String identifier) {
    SchoolDataSource schoolDataSource = schoolDataSourceDAO.findByIdentifier(dataSource);
    if (dataSource != null) {
      return userSchoolDataController.findUserGroup(schoolDataSource, identifier);
    }
    
    return null;
  }
  
  public UserGroup findUserGroup(SchoolDataSource schoolDataSource, String identifier) {
    return userSchoolDataController.findUserGroup(schoolDataSource, identifier);
  }

  public UserGroup findUserGroup(UserGroupEntity userGroupEntity) {
    return findUserGroup(userGroupEntity.getSchoolDataSource(), userGroupEntity.getIdentifier());
  }
  
}
