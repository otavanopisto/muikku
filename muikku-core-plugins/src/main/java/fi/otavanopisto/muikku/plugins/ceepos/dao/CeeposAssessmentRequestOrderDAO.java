package fi.otavanopisto.muikku.plugins.ceepos.dao;

import java.util.Date;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposAssessmentRequestOrder;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrderState;

public class CeeposAssessmentRequestOrderDAO extends CorePluginsDAO<CeeposAssessmentRequestOrder> {

  private static final long serialVersionUID = 7271889670911991559L;

  public CeeposAssessmentRequestOrder create(String studentIdentifier, Long productId, String productCode,
      String productDescription, Integer productPrice, Long userEntityId, Long workspaceEntityId, String requestText) {
    CeeposAssessmentRequestOrder order = new CeeposAssessmentRequestOrder();

    order.setUserIdentifier(studentIdentifier);
    order.setProductId(productId);
    order.setProductCode(productCode);
    order.setProductDescription(productDescription);
    order.setProductPrice(productPrice);
    order.setState(CeeposOrderState.CREATED);
    order.setWorkspaceEntityId(workspaceEntityId);
    order.setRequestText(requestText);
    Date now = new Date();
    order.setCreated(now);
    order.setCreatorId(userEntityId);
    order.setLastModified(now);
    order.setLastModifierId(userEntityId);
    order.setArchived(Boolean.FALSE);

    return persist(order);
  }

}
