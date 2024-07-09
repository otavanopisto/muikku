package fi.otavanopisto.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryJournalField;
import fi.otavanopisto.muikku.plugins.material.model.QueryJournalField_;

public class QueryJournalFieldDAO extends CorePluginsDAO<QueryJournalField> {

  private static final long serialVersionUID = 6521222256472850371L;

  public QueryJournalField create(Material material, String name) {

    QueryJournalField queryJournalField = new QueryJournalField();

    queryJournalField.setMaterial(material);
    queryJournalField.setName(name);

    return persist(queryJournalField);
  }

  public QueryJournalField findByMaterialAndName(Material material, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryJournalField> criteria = criteriaBuilder.createQuery(QueryJournalField.class);
    Root<QueryJournalField> root = criteria.from(QueryJournalField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryJournalField_.material), material),
        criteriaBuilder.equal(root.get(QueryJournalField_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public void delete(QueryJournalField queryField) {
    super.delete(queryField);
  }

}
