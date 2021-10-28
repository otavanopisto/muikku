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
  
  public CeeposStudyTimeOrder createStudyTimeOrder(String studentIdentifier, CeeposProduct product, String studentEmail, String staffEmail) {
    return ceeposStudyTimeOrderDAO.create(studentIdentifier, product, studentEmail, staffEmail);
  }

  public CeeposOrder findOrder(Long id) {
    return ceeposOrderDAO.findById(id);
  }
  
  public CeeposProduct findProductByCode(String code) {
    return ceeposProductDAO.findByCode(code);
  }

  public List<CeeposProduct> listProducts() {
    return ceeposProductDAO.listAll();
  }
  
  public List<CeeposOrder> listOrdersByUserIdentifier(String userIdentifier) {
    List<CeeposOrder> payments = ceeposOrderDAO.listByUserIdentifierAndArchived(userIdentifier, false);
    payments.sort(Comparator.comparing(CeeposOrder::getCreated).reversed());
    return payments;
  }
  
  public CeeposOrder updateOrderState(CeeposOrder order, CeeposOrderState state) {
    return ceeposOrderDAO.updateState(order, state);
  }

  public CeeposOrder updateOrderEmail(CeeposOrder order, String email) {
    return ceeposOrderDAO.updateEmail(order, email);
  }
  
  public CeeposStudyTimeOrder updateStudyTimeOrderStateAndStudyDates(CeeposStudyTimeOrder order, CeeposOrderState state, Date oldStudyTimeEnd, Date newStudyTimeEnd) {
    return ceeposStudyTimeOrderDAO.updateStateAndStudyDates(order, state, oldStudyTimeEnd, newStudyTimeEnd);
  }

  public CeeposOrder updateOrderStateAndOrderNumber(CeeposOrder order, CeeposOrderState state, String orderNumber) {
    return ceeposOrderDAO.updateStateAndOrderNumber(order, state, orderNumber);
  }

  public CeeposOrder updateOrderStateAndOrderNumberAndPaymentAddress(CeeposOrder order, CeeposOrderState state, String orderNumber, String address) {
    return ceeposOrderDAO.updateStateAndOrderNumberAndPaymentAddress(order, state, orderNumber, address);
  }
  
}
