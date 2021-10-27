package fi.otavanopisto.muikku.plugins.ceepos.dao;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrderState;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposProduct;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposStudyTimeOrder;

public class CeeposStudyTimeOrderDAO extends CorePluginsDAO<CeeposStudyTimeOrder> {

  private static final long serialVersionUID = 1309648327001378444L;
  
  public CeeposStudyTimeOrder create(String staffEmail, String studentIdentifier, CeeposProduct product) {
    CeeposStudyTimeOrder payment = new CeeposStudyTimeOrder();
    
    payment.setStaffEmail(staffEmail);
    payment.setUserIdentifier(studentIdentifier);
    payment.setProduct(product);
    payment.setState(CeeposOrderState.CREATED);
    Date now = new Date();
    payment.setCreated(now);
    payment.setLastModified(now);
    
    return persist(payment);
  }
  
  public CeeposStudyTimeOrder updateState(CeeposStudyTimeOrder payment, CeeposOrderState state) {
    payment.setState(state);
    payment.setLastModified(new Date());
    return persist(payment);
  }

  public CeeposStudyTimeOrder updateStateAndStudyDates(CeeposStudyTimeOrder payment, CeeposOrderState state, Date oldStudyTimeEnd, Date newStudyTimeEnd) {
    payment.setState(state);
    payment.setPreStudyTimeEnd(oldStudyTimeEnd);
    payment.setPostStudyTimeEnd(newStudyTimeEnd);
    payment.setLastModified(new Date());
    return persist(payment);
  }

}
