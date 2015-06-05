package fi.muikku.users;

public class UserGroupController {
  
  /*

  @Inject
  private UserGroupEntityDAO userGroupDAO;
  
  @Inject
  private GroupUserEntityDAO userGroupUserDAO;

  public List<UserGroup> searchUserGroups(String searchTerm) {
    List<UserGroup> grps = userGroupDAO.listAll();
    List<UserGroup> filtered = new ArrayList<UserGroup>();

    for (UserGroup grp : grps) {
      if (grp.getName().toLowerCase().contains(searchTerm.toLowerCase()))
        filtered.add(grp);
    }

    return filtered;
  }

  public UserGroup findUserGroup(Long userGroupId) {
    return userGroupDAO.findById(userGroupId);
  }

  public List<UserGroupUser> listUserGroupUsers(UserGroup userGroup) {
    return userGroupUserDAO.listByUserGroup(userGroup);
  }

  public List<UserGroup> listUserGroupsByUser(UserEntity userEntity) {
    return userGroupDAO.listByUser(userEntity);
  }
  
  public Long getUserGroupMemberCount(UserGroup userGroup) {
    return userGroupUserDAO.countByUserGroup(userGroup);
  }
  
  */
  
}
