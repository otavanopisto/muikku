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
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrder_;

public class CeeposOrderDAO extends CorePluginsDAO<CeeposOrder> {

  private static final long serialVersionUID = 7208631769909993803L;
  
  public CeeposOrder findByIdAndArchived(Long id, boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CeeposOrder> criteria = criteriaBuilder.createQuery(CeeposOrder.class);
    Root<CeeposOrder> root = criteria.from(CeeposOrder.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(CeeposOrder_.id), id),
        criteriaBuilder.equal(root.get(CeeposOrder_.archived), archived)
      )
    );

    return entityManager.createQuery(criteria).getSingleResult();
  }
  
  public List<CeeposOrder> listByUserIdentifierAndArchived(String userIdentifier, boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CeeposOrder> criteria = criteriaBuilder.createQuery(CeeposOrder.class);
    Root<CeeposOrder> root = criteria.from(CeeposOrder.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(CeeposOrder_.userIdentifier), userIdentifier),
        criteriaBuilder.equal(root.get(CeeposOrder_.archived), archived)
      )
    );

    return entityManager.createQuery(criteria).getResultList();
  }
  
  public CeeposOrder updateState(CeeposOrder order, CeeposOrderState state) {
    order.setState(state);
    order.setLastModified(new Date());
    return persist(order);
  }

  public CeeposOrder updateEmail(CeeposOrder order, String email) {
    order.setEmail(email);
    order.setLastModified(new Date());
    return persist(order);
  }

  public CeeposOrder updateStateAndOrderNumberAndPaymentAddress(CeeposOrder order, CeeposOrderState state, String orderNumber, String paymentAddress) {
    order.setState(state);
    order.setCeeposOrderNumber(orderNumber);
    order.setCeeposPaymentAddress(paymentAddress);
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
