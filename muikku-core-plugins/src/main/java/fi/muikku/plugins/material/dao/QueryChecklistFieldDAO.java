package fi.muikku.plugins.material.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.material.model.Material;
import fi.muikku.plugins.material.model.QueryChecklistField;
import fi.muikku.plugins.material.model.QueryChecklistField_;

@DAO
public class QueryChecklistFieldDAO extends PluginDAO<QueryChecklistField> {
	
	private static final long serialVersionUID = -5327160259588566934L;
	
	public QueryChecklistField create(Material material, String name){
		
		QueryChecklistField queryChecklistField = new QueryChecklistField();
		
		queryChecklistField.setMaterial(material);
		queryChecklistField.setName(name);
		
		return persist(queryChecklistField);
	}

  public QueryChecklistField findByMaterialAndName(Material material, String name) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<QueryChecklistField> criteria = criteriaBuilder.createQuery(QueryChecklistField.class);
    Root<QueryChecklistField> root = criteria.from(QueryChecklistField.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(QueryChecklistField_.material), material),
        criteriaBuilder.equal(root.get(QueryChecklistField_.name), name)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
