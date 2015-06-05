package fi.muikku.dao.users;

import fi.muikku.dao.CoreDAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.users.GroupUserEntity;

public class GroupUserEntityDAO extends CoreDAO<GroupUserEntity> {

  private static final long serialVersionUID = -2602347893195385174L;

  public GroupUserEntity create(boolean archived,
                                SchoolDataSource defaultSchoolDataSource,
                                String defaultIdentifier,
                                UserGroupEntity userGroupEntity
  ) {
    GroupUserEntity userGroupUser = new GroupUserEntity();

    userGroupUser.setArchived(archived);
    userGroupUser.setDefaultSchoolDataSource(defaultSchoolDataSource);
    userGroupUser.setDefaultIdentifier(defaultIdentifier);
    userGroupUser.setUserGroupEntity(userGroupEntity);

    getEntityManager().persist(userGroupUser);

    return userGroupUser;
  }
}