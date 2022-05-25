package fi.otavanopisto.muikku.plugins.hops.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudyHours;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudyHours_;

public class HopsStudyHoursDAO extends CorePluginsDAO<HopsStudyHours> {

  private static final long serialVersionUID = 4189552701280944144L;

  public HopsStudyHours create(String studentIdentifier, Integer hours) {
    HopsStudyHours hopsStudyHours = new HopsStudyHours();
    hopsStudyHours.setStudentIdentifier(studentIdentifier);
    hopsStudyHours.setStudyHours(hours);
    return persist(hopsStudyHours);
  }

  public HopsStudyHours updateStudyHours(HopsStudyHours hopsStudyHours, Integer hours) {
    hopsStudyHours.setStudyHours(hours);
    return persist(hopsStudyHours);
  }

  public HopsStudyHours findByStudentIdentifier(String studentIdentifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsStudyHours> criteria = criteriaBuilder.createQuery(HopsStudyHours.class);
    Root<HopsStudyHours> root = criteria.from(HopsStudyHours.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(HopsStudyHours_.studentIdentifier), studentIdentifier)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

}
