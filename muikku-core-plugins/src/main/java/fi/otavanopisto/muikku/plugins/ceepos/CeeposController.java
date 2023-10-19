package fi.otavanopisto.muikku.plugins.ceepos;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.ceepos.dao.CeeposAssessmentRequestOrderDAO;
import fi.otavanopisto.muikku.plugins.ceepos.dao.CeeposOrderDAO;
import fi.otavanopisto.muikku.plugins.ceepos.dao.CeeposProductDAO;
import fi.otavanopisto.muikku.plugins.ceepos.dao.CeeposStudyTimeOrderDAO;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposAssessmentRequestOrder;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrder;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrderState;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposProduct;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposProductType;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposStudyTimeOrder;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.workspaces.WorkspaceEntityName;

public class CeeposController {
  
  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private LocaleController localeController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private CeeposProductDAO ceeposProductDAO;

  @Inject
  private CeeposOrderDAO ceeposOrderDAO;

  @Inject
  private CeeposStudyTimeOrderDAO ceeposStudyTimeOrderDAO;

  @Inject
  private CeeposAssessmentRequestOrderDAO ceeposAssessmentRequestOrderDAO;
  
  public CeeposStudyTimeOrder createStudyTimeOrder(String studentIdentifier, CeeposProduct product, String studentEmail, Long userEntityId) {
    return ceeposStudyTimeOrderDAO.create(studentIdentifier, product.getId(), product.getCode(), product.getDescription(), product.getPrice(), studentEmail, userEntityId);
  }
  
  public CeeposAssessmentRequestOrder createAssessmentRequestOrder(CeeposProduct product, UserEntity userEntity, WorkspaceEntity workspaceEntity, String requestText, Integer price) {
    
    // Workspace name and product description
    
    WorkspaceEntityName workspaceEntityName = workspaceEntityController.getName(workspaceEntity);
    if (workspaceEntityName == null) {
      logger.severe(String.format("Unable to determine workspace name for workspace entity %d", workspaceEntity.getId()));
      return null;
    }
    String description = localeController.getText(sessionController.getLocale(), "ceepos.assessmentRequestOrderDescription", new String[] {
        workspaceEntityName.getDisplayName()
    });
    
    // Order creation
    
    CeeposAssessmentRequestOrder order = ceeposAssessmentRequestOrderDAO.create(
        userEntity.defaultSchoolDataIdentifier().toId(),
        product.getId(),
        product.getCode(),
        description,
        price,
        userEntity.getId(),
        workspaceEntity.getId(),
        requestText);
    
    return order;
  }

  public CeeposOrder findOrderById(Long id) {
    return ceeposOrderDAO.findById(id);
  }
  
  public CeeposAssessmentRequestOrder findAssessmentRequestOrderById(Long id) {
    return ceeposAssessmentRequestOrderDAO.findById(id);
  }

  public List<CeeposAssessmentRequestOrder> listAssessmentRequestOrdersByStudentAndWorkspaceAndArchived(String studentIdentifier, Long workspaceEntityId, Boolean archived) {
    return ceeposAssessmentRequestOrderDAO.listByStudentAndWorkspaceAndArchived(studentIdentifier, workspaceEntityId, archived);
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
  
  public CeeposProduct findProductByType(CeeposProductType type) {
    List<CeeposProduct> products = ceeposProductDAO.listByType(type);
    return products.size() == 1 ? products.get(0) : null;
  }

  public CeeposProduct findProductByCode(String code) {
    return ceeposProductDAO.findByCode(code);
  }

  public List<CeeposProduct> listProducts(String line) {
    return StringUtils.isEmpty(line) ? ceeposProductDAO.listAll() : ceeposProductDAO.listByLine(line);
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

  public CeeposOrder updateOrderStateAndOrderNumberAndPaid(CeeposOrder order, CeeposOrderState state, String orderNumber, Date paid, Long userEntityId) {
    return ceeposOrderDAO.updateStateAndOrderNumberAndPaid(order, state, orderNumber, paid, userEntityId);
  }
  
  public CeeposAssessmentRequestOrder updateRequestText(CeeposAssessmentRequestOrder order, String requestText) {
    return ceeposAssessmentRequestOrderDAO.updateRequestText(order, requestText);
  }
}
