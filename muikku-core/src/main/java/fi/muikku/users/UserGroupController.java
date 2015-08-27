package fi.muikku.users;

import javax.inject.Inject;

import fi.muikku.dao.base.SchoolDataSourceDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.schooldata.UserSchoolDataController;
import fi.muikku.schooldata.entity.UserGroup;

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
