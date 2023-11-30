package fi.otavanopisto.muikku.plugins.pedagogy.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyForm;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyFormState;
import fi.otavanopisto.muikku.plugins.pedagogy.model.PedagogyForm_;

public class PedagogyFormDAO extends CorePluginsDAO<PedagogyForm> {

  private static final long serialVersionUID = -27331130177561637L;
  
  public PedagogyForm create(String studentIdentifier, String formData, PedagogyFormState state, String visibility) {
    PedagogyForm form = new PedagogyForm();
    form.setFormData(formData);
    form.setState(state);
    form.setStudentIdentifier(studentIdentifier);
    return persist(form);
  }
  
  public PedagogyForm updateFormData(PedagogyForm form, String formData) {
    form.setFormData(formData);
    return persist(form);
  }
  
  public PedagogyForm updateState(PedagogyForm form, PedagogyFormState state) {
    form.setState(state);
    return persist(form);
  }
  
  public PedagogyForm findByStudentIdentifier(String studentIdentifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<PedagogyForm> criteria = criteriaBuilder.createQuery(PedagogyForm.class);
    Root<PedagogyForm> root = criteria.from(PedagogyForm.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(PedagogyForm_.studentIdentifier), studentIdentifier)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

}
