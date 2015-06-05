package fi.muikku.dao.users;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserGroupEntity;

public class UserGroupEntityDAO extends CoreDAO<UserGroupEntity> {

  private static final long serialVersionUID = -2602347893195385174L;

  public UserGroupEntity create(Boolean archived, SchoolDataSource defaultSchoolDataSource, String defaultIdentifier) {
    UserGroupEntity userGroup = new UserGroupEntity();
    
    userGroup.setArchived(archived);
    userGroup.setDefaultSchoolDataSource(defaultSchoolDataSource);
    userGroup.setDefaultIdentifier(defaultIdentifier);

    getEntityManager().persist(userGroup);

    return userGroup;
  }

}