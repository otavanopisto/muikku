package fi.otavanopisto.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.material.model.QueryMultiSelectField_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryMultiSelectField;


public class QueryMultiSelectFieldDAO extends CorePluginsDAO<QueryMultiSelectField> {
	
	private static final long serialVersionUID = -5327160259588566934L;
	
	public QueryMultiSelectField create(Material material, String name){
		
		QueryMultiSelectField queryMultiSelectField = new QueryMultiSelectField();
		
		queryMultiSelectField.setMaterial(material);
		queryMultiSelectField.setName(name);
		
		return persist(queryMultiSelectField);
	}

  public QueryMultiSelectField findByMaterialAndName(Material material, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryMultiSelectField> criteria = criteriaBuilder.createQuery(QueryMultiSelectField.class);
    Root<QueryMultiSelectField> root = criteria.from(QueryMultiSelectField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryMultiSelectField_.material), material),
        criteriaBuilder.equal(root.get(QueryMultiSelectField_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public void delete(QueryMultiSelectField queryField) {
    super.delete(queryField);
  }
  
}
