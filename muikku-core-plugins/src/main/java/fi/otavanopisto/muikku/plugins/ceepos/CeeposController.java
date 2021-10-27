package fi.otavanopisto.muikku.plugins.ceepos;

import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.ceepos.dao.CeeposOrderDAO;
import fi.otavanopisto.muikku.plugins.ceepos.dao.CeeposProductDAO;
import fi.otavanopisto.muikku.plugins.ceepos.dao.CeeposStudyTimeOrderDAO;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrder;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrderState;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposProduct;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposStudyTimeOrder;

public class CeeposController {
  
  @Inject
  private CeeposProductDAO ceeposProductDAO;

  @Inject
  private CeeposOrderDAO ceeposOrderDAO;

  @Inject
  private CeeposStudyTimeOrderDAO ceeposStudyTimeOrderDAO;
  
  public CeeposStudyTimeOrder createStudyTimeOrder(String staffEmail, String studentIdentifier, CeeposProduct product) {
    return ceeposStudyTimeOrderDAO.create(staffEmail, studentIdentifier, product);
  }

  public CeeposOrder findOrder(Long id) {
    return ceeposOrderDAO.findById(id);
  }
  
  public CeeposProduct findProductByCode(String code) {
    return ceeposProductDAO.findByCode(code);
  }
  
  public List<CeeposOrder> listOrdersByUserIdentifier(String userIdentifier) {
    List<CeeposOrder> payments = ceeposOrderDAO.listByUserIdentifierAndArchived(userIdentifier, false);
    payments.sort(Comparator.comparing(CeeposOrder::getCreated).reversed());
    return payments;
  }
  
  public CeeposOrder updateOrderEmail(CeeposOrder payment, String email) {
    return ceeposOrderDAO.updateEmail(payment, email);
  }

  public CeeposStudyTimeOrder updateStudyTimePaymentState(CeeposStudyTimeOrder payment, CeeposOrderState state) {
    return ceeposStudyTimeOrderDAO.updateState(payment, state);
  }

  public CeeposStudyTimeOrder updateStudyTimeOrderStateAndStudyDates(CeeposStudyTimeOrder payment, CeeposOrderState state, Date oldStudyTimeEnd, Date newStudyTimeEnd) {
    return ceeposStudyTimeOrderDAO.updateStateAndStudyDates(payment, state, oldStudyTimeEnd, newStudyTimeEnd);
  }

  public CeeposOrder updateOrderStateAndOrderNumber(CeeposOrder order, CeeposOrderState state, String orderNumber) {
    return ceeposOrderDAO.updateStateAndOrderNumber(order, state, orderNumber);
  }

  public CeeposOrder updateOrderStateAndOrderNumberAndPaymentAddress(CeeposOrder order, CeeposOrderState state, String orderNumber, String address) {
    return ceeposOrderDAO.updateStateAndOrderNumberAndAddress(order, state, orderNumber, address);
  }
  
}
