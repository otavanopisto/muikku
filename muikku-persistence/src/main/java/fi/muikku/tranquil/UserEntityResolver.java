package fi.muikku.tranquil;

import fi.muikku.dao.users.UserEntityDAO;
import fi.tranquil.processing.PropertyAccessor;

public class UserEntityResolver extends AbstractTranquilEntityResolver {
  
  @Override
  public Object resolveEntity(Object entity, String idProperty) {
    PropertyAccessor propertyAccessor = new PropertyAccessor();
    
    try {
      Long id = (Long) propertyAccessor.extractProperty(entity, idProperty);
      
      UserEntityDAO userEntityDAO = (UserEntityDAO) getManagedBean(UserEntityDAO.class);
      
      return userEntityDAO.findById(id);
    } catch (Exception ex) {
      ex.printStackTrace();
    }
    
    return null;
  }
  
}
