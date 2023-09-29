package fi.otavanopisto.muikku.plugins.ceepos.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposAssessmentRequestOrder;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposAssessmentRequestOrder_;
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
  
  public CeeposAssessmentRequestOrder updateRequestText(CeeposAssessmentRequestOrder order, String requestText) {
    order.setRequestText(requestText);
    return persist(order);
  }
  
  public List<CeeposAssessmentRequestOrder> listByStudentAndWorkspaceAndArchived(String studentIdentifier, Long workspaceEntityId, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CeeposAssessmentRequestOrder> criteria = criteriaBuilder.createQuery(CeeposAssessmentRequestOrder.class);
    Root<CeeposAssessmentRequestOrder> root = criteria.from(CeeposAssessmentRequestOrder.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(          
        criteriaBuilder.equal(root.get(CeeposAssessmentRequestOrder_.userIdentifier), studentIdentifier),
        criteriaBuilder.equal(root.get(CeeposAssessmentRequestOrder_.workspaceEntityId), workspaceEntityId),
        criteriaBuilder.equal(root.get(CeeposAssessmentRequestOrder_.archived), archived)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
  }

}
