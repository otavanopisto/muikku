package fi.otavanopisto.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.material.model.QueryConnectField_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.Material;
import fi.otavanopisto.muikku.plugins.material.model.QueryConnectField;

public class QueryConnectFieldDAO extends CorePluginsDAO<QueryConnectField> {
	
  private static final long serialVersionUID = 5188632608986411717L;

  public QueryConnectField create(Material material, String name){
		
		QueryConnectField queryConnectField = new QueryConnectField();
		
		queryConnectField.setMaterial(material);
		queryConnectField.setName(name);
		
		return persist(queryConnectField);
	}

  public QueryConnectField findByMaterialAndName(Material material, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryConnectField> criteria = criteriaBuilder.createQuery(QueryConnectField.class);
    Root<QueryConnectField> root = criteria.from(QueryConnectField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryConnectField_.material), material),
        criteriaBuilder.equal(root.get(QueryConnectField_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public void delete(QueryConnectField queryField) {
    super.delete(queryField);
  }
  
}
