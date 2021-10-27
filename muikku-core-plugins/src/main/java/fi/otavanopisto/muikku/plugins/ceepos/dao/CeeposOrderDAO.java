package fi.otavanopisto.muikku.plugins.ceepos.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrder;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrderState;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposPayment_;

public class CeeposOrderDAO extends CorePluginsDAO<CeeposOrder> {

  private static final long serialVersionUID = 7208631769909993803L;
  
  public List<CeeposOrder> listByUserIdentifierAndArchived(String userIdentifier, boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CeeposOrder> criteria = criteriaBuilder.createQuery(CeeposOrder.class);
    Root<CeeposOrder> root = criteria.from(CeeposOrder.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(CeeposPayment_.userIdentifier), userIdentifier),
        criteriaBuilder.equal(root.get(CeeposPayment_.archived), archived)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
    
  }

  public CeeposOrder updateEmail(CeeposOrder order, String email) {
    order.setEmail(email);
    order.setLastModified(new Date());
    return persist(order);
  }
  
  public CeeposOrder updateStateAndOrderNumberAndAddress(CeeposOrder order, CeeposOrderState state, String orderNumber, String address) {
    order.setState(state);
    order.setCeeposOrderNumber(orderNumber);
    order.setCeeposPaymentAddress(address);
    order.setLastModified(new Date());
    return persist(order);
  }

  public CeeposOrder updateStateAndOrderNumber(CeeposOrder order, CeeposOrderState state, String orderNumber) {
    order.setState(state);
    order.setCeeposOrderNumber(orderNumber);
    order.setLastModified(new Date());
    return persist(order);
  }

}
