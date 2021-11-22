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
  
  public CeeposStudyTimeOrder createStudyTimeOrder(String studentIdentifier, CeeposProduct product, String studentEmail, Long userEntityId) {
    return ceeposStudyTimeOrderDAO.create(studentIdentifier, product.getId(), product.getCode(), product.getDescription(), product.getPrice(), studentEmail, userEntityId);
  }

  public CeeposOrder findOrderById(Long id) {
    return ceeposOrderDAO.findById(id);
  }

  public CeeposOrder findOrderByIdAndArchived(Long id, boolean archived) {
    return ceeposOrderDAO.findByIdAndArchived(id, archived);
  }
  
  public CeeposOrder archiveOrder(CeeposOrder ceeposOrder, Long userEntityId) {
    return ceeposOrderDAO.updateArchived(ceeposOrder, Boolean.TRUE, userEntityId);
  }
  
  public CeeposProduct findProductById(Long productId) {
    return ceeposProductDAO.findById(productId);
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
  
  public CeeposOrder updateOrderState(CeeposOrder order, CeeposOrderState state, Long userEntityId) {
    return ceeposOrderDAO.updateState(order, state, userEntityId);
  }

  public CeeposStudyTimeOrder updateStudyTimeOrderStateAndStudyDates(CeeposStudyTimeOrder order, CeeposOrderState state, Date oldStudyTimeEnd, Date newStudyTimeEnd, Long userEntityId) {
    return ceeposStudyTimeOrderDAO.updateStateAndStudyDates(order, state, oldStudyTimeEnd, newStudyTimeEnd, userEntityId);
  }

  public CeeposOrder updateOrderStateAndOrderNumber(CeeposOrder order, CeeposOrderState state, String orderNumber, Long userEntityId) {
    return ceeposOrderDAO.updateStateAndOrderNumber(order, state, orderNumber, userEntityId);
  }

  public CeeposOrder updateOrderStateAndOrderNumberAndPaymentAddress(CeeposOrder order, CeeposOrderState state, String orderNumber, String address, Long userEntityId) {
    return ceeposOrderDAO.updateStateAndOrderNumberAndPaymentAddress(order, state, orderNumber, address, userEntityId);
  }
  
}
