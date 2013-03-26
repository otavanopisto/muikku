package fi.muikku.dao.users;

import fi.muikku.dao.CoreDAO;
import fi.muikku.dao.DAO;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.stub.users.UserEntity;


@DAO
public class UserEntityDAO extends CoreDAO<UserEntity> {

	private static final long serialVersionUID = 3790128454976388680L;

	public UserEntity create(SchoolDataSource dataSource, Boolean archived) {
    UserEntity user = new UserEntity();
    
    user.setDataSource(dataSource);
    user.setArchived(archived);
    
    getEntityManager().persist(user);
    
    return user;
  }

}