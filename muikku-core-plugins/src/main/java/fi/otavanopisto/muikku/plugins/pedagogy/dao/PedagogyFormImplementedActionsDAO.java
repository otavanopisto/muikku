package fi.otavanopisto.muikku.plugins.pedagogy.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormImplementedActions;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormImplementedActions_;

public class PedagogyFormImplementedActionsDAO extends CorePluginsDAO<PedagogyFormImplementedActions> {
  
  private static final long serialVersionUID = -6508061382983935429L;

  public PedagogyFormImplementedActions create(Long userEntityId, String formData) {
    PedagogyFormImplementedActions form = new PedagogyFormImplementedActions();
    form.setFormData(formData);
    form.setUserEntityId(userEntityId);
    return persist(form);
  }
  
  public PedagogyFormImplementedActions updateFormData(PedagogyFormImplementedActions form, String formData) {
    form.setFormData(formData);
    return persist(form);
  }
  
  public PedagogyFormImplementedActions findByUserEntityId(Long userEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<PedagogyFormImplementedActions> criteria = criteriaBuilder.createQuery(PedagogyFormImplementedActions.class);
    Root<PedagogyFormImplementedActions> root = criteria.from(PedagogyFormImplementedActions.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(PedagogyFormImplementedActions_.userEntityId), userEntityId)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

}
