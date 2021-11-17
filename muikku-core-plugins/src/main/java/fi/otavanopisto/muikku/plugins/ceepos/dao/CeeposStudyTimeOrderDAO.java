package fi.otavanopisto.muikku.plugins.ceepos.dao;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrderState;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposStudyTimeOrder;

public class CeeposStudyTimeOrderDAO extends CorePluginsDAO<CeeposStudyTimeOrder> {

  private static final long serialVersionUID = 1309648327001378444L;
  
  public CeeposStudyTimeOrder create(String studentIdentifier, Long productId, String productCode, String productDescription, Integer productPrice, String userEmail, Long userEntityId) {
    CeeposStudyTimeOrder order = new CeeposStudyTimeOrder();
    
    order.setUserIdentifier(studentIdentifier);
    order.setProductId(productId);
    order.setProductCode(productCode);
    order.setProductDescription(productDescription);
    order.setProductPrice(productPrice);
    order.setState(CeeposOrderState.CREATED);
    Date now = new Date();
    order.setCreated(now);
    order.setCreatorId(userEntityId);
    order.setLastModified(now);
    order.setLastModifierId(userEntityId);
    order.setArchived(Boolean.FALSE);
    
    return persist(order);
  }
  
  public CeeposStudyTimeOrder updateStateAndStudyDates(CeeposStudyTimeOrder payment, CeeposOrderState state, Date oldStudyTimeEnd, Date newStudyTimeEnd, Long userEntityId) {
    payment.setState(state);
    payment.setPreStudyTimeEnd(oldStudyTimeEnd);
    payment.setPostStudyTimeEnd(newStudyTimeEnd);
    payment.setLastModified(new Date());
    payment.setLastModifierId(userEntityId);
    return persist(payment);
  }

}
