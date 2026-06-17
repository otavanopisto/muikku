package fi.otavanopisto.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.material.Material;
import fi.otavanopisto.muikku.model.material.QuerySelectField;
import fi.otavanopisto.muikku.model.material.QuerySelectField_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;


public class QuerySelectFieldDAO extends CorePluginsDAO<QuerySelectField> {
	
	private static final long serialVersionUID = -5327160259588566934L;
	
	public QuerySelectField create(Material material, String name){
		
		QuerySelectField querySelectField = new QuerySelectField();
		
		querySelectField.setMaterial(material);
		querySelectField.setName(name);
		
		return persist(querySelectField);
	}

  public QuerySelectField findByMaterialAndName(Material material, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QuerySelectField> criteria = criteriaBuilder.createQuery(QuerySelectField.class);
    Root<QuerySelectField> root = criteria.from(QuerySelectField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QuerySelectField_.material), material),
        criteriaBuilder.equal(root.get(QuerySelectField_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public void delete(QuerySelectField queryField) {
    super.delete(queryField);
  }
  
}
