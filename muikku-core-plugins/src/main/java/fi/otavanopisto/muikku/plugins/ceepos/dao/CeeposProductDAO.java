package fi.otavanopisto.muikku.plugins.ceepos.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.ceepos.CeeposProduct;
import fi.otavanopisto.muikku.model.ceepos.CeeposProductType;
import fi.otavanopisto.muikku.model.ceepos.CeeposProduct_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;

public class CeeposProductDAO extends CorePluginsDAO<CeeposProduct> {

  private static final long serialVersionUID = 981691539518990894L;
  
  public CeeposProduct findByCode(String code) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CeeposProduct> criteria = criteriaBuilder.createQuery(CeeposProduct.class);
    Root<CeeposProduct> root = criteria.from(CeeposProduct.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(CeeposProduct_.code), code)
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public List<CeeposProduct> listByLine(String line) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CeeposProduct> criteria = criteriaBuilder.createQuery(CeeposProduct.class);
    Root<CeeposProduct> root = criteria.from(CeeposProduct.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(CeeposProduct_.line), line)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public List<CeeposProduct> listByType(CeeposProductType type ) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CeeposProduct> criteria = criteriaBuilder.createQuery(CeeposProduct.class);
    Root<CeeposProduct> root = criteria.from(CeeposProduct.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(CeeposProduct_.type), type)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

}
