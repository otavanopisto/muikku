package fi.otavanopisto.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.material.model.QueryAudioField_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryAudioField;

public class QueryAudioFieldDAO extends CorePluginsDAO<QueryAudioField> {

  private static final long serialVersionUID = 7994143075914180599L;

  public QueryAudioField create(Material material, String name) {

    QueryAudioField queryAudioField = new QueryAudioField();

    queryAudioField.setMaterial(material);
    queryAudioField.setName(name);

    return persist(queryAudioField);
  }

  public QueryAudioField findByMaterialAndName(Material material, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryAudioField> criteria = criteriaBuilder.createQuery(QueryAudioField.class);
    Root<QueryAudioField> root = criteria.from(QueryAudioField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryAudioField_.material), material),
        criteriaBuilder.equal(root.get(QueryAudioField_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public void delete(QueryAudioField queryField) {
    super.delete(queryField);
  }
  
}
