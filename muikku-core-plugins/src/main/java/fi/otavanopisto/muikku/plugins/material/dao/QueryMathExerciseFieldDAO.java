package fi.otavanopisto.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryMathExerciseField;
import fi.otavanopisto.muikku.plugins.material.model.QueryMathExerciseField_;

public class QueryMathExerciseFieldDAO extends CorePluginsDAO<QueryMathExerciseField> {

  private static final long serialVersionUID = 3350657264982162385L;

  public QueryMathExerciseField create(Material material, String name) {
    QueryMathExerciseField queryField = new QueryMathExerciseField();

    queryField.setMaterial(material);
    queryField.setName(name);

    return persist(queryField);
  }

  public QueryMathExerciseField findByMaterialAndName(Material material, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryMathExerciseField> criteria = criteriaBuilder.createQuery(QueryMathExerciseField.class);
    Root<QueryMathExerciseField> root = criteria.from(QueryMathExerciseField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryMathExerciseField_.material), material),
        criteriaBuilder.equal(root.get(QueryMathExerciseField_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public void delete(QueryMathExerciseField queryField) {
    super.delete(queryField);
  }
  
}
