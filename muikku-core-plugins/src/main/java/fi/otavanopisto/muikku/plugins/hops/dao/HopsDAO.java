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
  
  public Hops create(String studentIdentifier, String formData) {
    Hops hops = new Hops();
    hops.setStudentIdentifier(studentIdentifier);
    hops.setFormData(formData);
    return persist(hops);
  }

  public Hops updateFormData(Hops hops, String formData) {
    hops.setFormData(formData);
    return persist(hops);
  }

  public Hops findByStudentIdentifier(String studentIdentifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Hops> criteria = criteriaBuilder.createQuery(Hops.class);
    Root<Hops> root = criteria.from(Hops.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(Hops_.studentIdentifier), studentIdentifier)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

}
