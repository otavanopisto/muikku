package fi.muikku.dao.users;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.users.UserGroup;


@DAO
public class UserGroupDAO extends CoreDAO<UserGroup> {

  private static final long serialVersionUID = -2602347893195385174L;

  public UserGroup create(String name) {
	  UserGroup userGroup = new UserGroup();

	  userGroup.setName(name);
    
    getEntityManager().persist(userGroup);
    
    return userGroup;
  }

}