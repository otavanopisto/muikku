package fi.otavanopisto.muikku.plugins.pedagogy.dao;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyForm;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyForm_;

public class PedagogyFormDAO extends CorePluginsDAO<PedagogyForm> {

  private static final long serialVersionUID = -27331130177561637L;
  
  public PedagogyForm create(Long userEntityId, String formData, String visibility) {
    PedagogyForm form = new PedagogyForm();
    form.setFormData(formData);
    form.setUserEntityId(userEntityId);
    return persist(form);
  }
  
  public PedagogyForm updateFormData(PedagogyForm form, String formData) {
    form.setFormData(formData);
    return persist(form);
  }
  
  public PedagogyForm updatePublished(PedagogyForm form, Date published) {
    form.setPublished(published);
    return persist(form);
  }
  
  public PedagogyForm findByUserEntityId(Long userEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<PedagogyForm> criteria = criteriaBuilder.createQuery(PedagogyForm.class);
    Root<PedagogyForm> root = criteria.from(PedagogyForm.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(PedagogyForm_.userEntityId), userEntityId)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public PedagogyForm findByUserEntityIdAndPublished(Long userEntityId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<PedagogyForm> criteria = criteriaBuilder.createQuery(PedagogyForm.class);
    Root<PedagogyForm> root = criteria.from(PedagogyForm.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(PedagogyForm_.userEntityId), userEntityId),
        criteriaBuilder.isNotNull(root.get(PedagogyForm_.published))
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

}
