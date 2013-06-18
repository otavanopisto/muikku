package fi.muikku.tranquil;

import fi.muikku.dao.users.UserEntityDAO;

public class UserEntityResolver extends AbstractTranquilEntityResolver {
  
  @Override
  public Object resolveEntity(Object id) {
    try {
      UserEntityDAO userEntityDAO = (UserEntityDAO) getManagedBean(UserEntityDAO.class);
      
      return userEntityDAO.findById((Long) id);
    } catch (Exception ex) {
      ex.printStackTrace();
    }
    
    return null;
  }
  
}
