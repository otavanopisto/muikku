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

    return getSingleResult(entityManager.createQuery(criteria));
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
  
  public CeeposOrder updateState(CeeposOrder order, CeeposOrderState state, Long userEntityId) {
    order.setState(state);
    order.setLastModified(new Date());
    order.setLastModifierId(userEntityId);
    return persist(order);
  }

  public CeeposOrder updateStateAndOrderNumberAndPaid(CeeposOrder order, CeeposOrderState state, String orderNumber, Date paid, Long userEntityId) {
    order.setState(state);
    order.setPaid(paid);
    order.setCeeposOrderNumber(orderNumber);
    order.setLastModified(new Date());
    order.setLastModifierId(userEntityId);
    return persist(order);
  }
  
  public CeeposOrder updateArchived(CeeposOrder order, Boolean archived, Long userEntityId) {
    order.setArchived(archived);
    order.setLastModified(new Date());
    order.setLastModifierId(userEntityId);
    return persist(order);
  }

}
