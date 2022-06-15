package fi.otavanopisto.muikku.plugins.hops.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.hops.model.HopsGoals;
import fi.otavanopisto.muikku.plugins.hops.model.HopsGoals_;

public class HopsGoalsDAO extends CorePluginsDAO<HopsGoals> {

  private static final long serialVersionUID = 5461337114574820695L;

  public HopsGoals create(String studentIdentifier, String goals) {
    HopsGoals hopsGoals = new HopsGoals();
    hopsGoals.setStudentIdentifier(studentIdentifier);
    hopsGoals.setGoals(goals);
    return persist(hopsGoals);
  }

  public HopsGoals updateGoalsData(HopsGoals hopsGoals, String goals) {
    hopsGoals.setGoals(goals);
    return persist(hopsGoals);
  }

  public HopsGoals findByStudentIdentifier(String studentIdentifier) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsGoals> criteria = criteriaBuilder.createQuery(HopsGoals.class);
    Root<HopsGoals> root = criteria.from(HopsGoals.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(HopsGoals_.studentIdentifier), studentIdentifier)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

}
