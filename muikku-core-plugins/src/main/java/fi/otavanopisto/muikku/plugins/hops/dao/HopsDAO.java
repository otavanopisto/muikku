package fi.otavanopisto.muikku.plugins.hops.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.hops.model.Hops;
import fi.otavanopisto.muikku.plugins.hops.model.Hops_;

public class HopsDAO extends CorePluginsDAO<Hops> {

  private static final long serialVersionUID = -3067066313510536520L;
  
  public Hops create(Long userEntityId, String category, String formData) {
    Hops hops = new Hops();
    hops.setUserEntityId(userEntityId);
    hops.setCategory(category);
    hops.setFormData(formData);
    return persist(hops);
  }

  public Hops updateFormData(Hops hops, String formData) {
    hops.setFormData(formData);
    return persist(hops);
  }

  public Hops findByUserEntityIdAndCategory(Long userEntityId, String category) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Hops> criteria = criteriaBuilder.createQuery(Hops.class);
    Root<Hops> root = criteria.from(Hops.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(Hops_.userEntityId), userEntityId),
        criteriaBuilder.equal(root.get(Hops_.category), category)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  // TODO Remove after conversion
  public Hops updateOwner(Hops hops, Long userEntityId, String category) {
    hops.setUserEntityId(userEntityId);
    hops.setCategory(category);
    return persist(hops);
  }

}
