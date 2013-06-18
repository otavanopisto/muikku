package fi.muikku.tranquil;

import fi.muikku.dao.base.TagDAO;

public class TagEntityResolver extends AbstractTranquilEntityResolver {
  
  @Override
  public Object resolveEntity(Object id) {
    try {
      TagDAO tagDAO = (TagDAO) getManagedBean(TagDAO.class);
      
      return tagDAO.findById((Long) id);
    } catch (Exception ex) {
      ex.printStackTrace();
    }
    
    return null;
  }
  
}
