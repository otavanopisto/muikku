package fi.otavanopisto.muikku.plugins.material.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.material.model.FaultyMaterial;
import fi.otavanopisto.muikku.plugins.material.model.FaultyMaterial_;

public class FaultyMaterialDAO extends CorePluginsDAO<FaultyMaterial> {
	
	private static final long serialVersionUID = -4795805032852772786L;

  public void delete(FaultyMaterial faultyMaterial) {
	  super.delete(faultyMaterial);
	}

	public List<FaultyMaterial> list(Long fromId, int maxResults) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FaultyMaterial> criteria = criteriaBuilder.createQuery(FaultyMaterial.class);
    Root<FaultyMaterial> root = criteria.from(FaultyMaterial.class);
    criteria.select(root);
    if (fromId != null) {
      criteria.where(
        criteriaBuilder.greaterThan(root.get(FaultyMaterial_.id), fromId)
      );
    }
    criteria.orderBy(criteriaBuilder.asc(root.get(FaultyMaterial_.id)));
   
    return entityManager.createQuery(criteria).setMaxResults(maxResults).getResultList();
	}
	
}
