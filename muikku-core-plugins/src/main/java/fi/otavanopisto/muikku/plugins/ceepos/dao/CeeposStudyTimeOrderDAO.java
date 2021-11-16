package fi.otavanopisto.muikku.plugins.ceepos.dao;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrderState;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposProduct;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposStudyTimeOrder;

public class CeeposStudyTimeOrderDAO extends CorePluginsDAO<CeeposStudyTimeOrder> {

  private static final long serialVersionUID = 1309648327001378444L;
  
  public CeeposStudyTimeOrder create(String studentIdentifier, CeeposProduct product, String userEmail, Long userEntityId) {
    CeeposStudyTimeOrder order = new CeeposStudyTimeOrder();
    
    order.setUserIdentifier(studentIdentifier);
    order.setProduct(product);
    order.setState(CeeposOrderState.CREATED);
    Date now = new Date();
    order.setCreated(now);
    order.setCreator(userEntityId);
    order.setLastModified(now);
    order.setLastModifier(userEntityId);
    order.setArchived(Boolean.FALSE);
    
    return persist(order);
  }
  
  public CeeposStudyTimeOrder updateStateAndStudyDates(CeeposStudyTimeOrder payment, CeeposOrderState state, Date oldStudyTimeEnd, Date newStudyTimeEnd, Long userEntityId) {
    payment.setState(state);
    payment.setPreStudyTimeEnd(oldStudyTimeEnd);
    payment.setPostStudyTimeEnd(newStudyTimeEnd);
    payment.setLastModified(new Date());
    payment.setLastModifier(userEntityId);
    return persist(payment);
  }

}
