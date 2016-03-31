package fi.otavanopisto.muikku.plugins.schooldatalocal.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUserPropertyKey_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUserPropertyKey;


public class LocalUserPropertyKeyDAO extends CorePluginsDAO<LocalUserPropertyKey> {

	private static final long serialVersionUID = 4968036949533696238L;

	public LocalUserPropertyKey create(String name, Boolean archived) {
		LocalUserPropertyKey localUserPropertyKey = new LocalUserPropertyKey();
		localUserPropertyKey.setName(name);
		localUserPropertyKey.setArchived(archived);
		
		return persist(localUserPropertyKey);
	}

	public LocalUserPropertyKey findByNameAndArchived(String name, Boolean archived) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LocalUserPropertyKey> criteria = criteriaBuilder.createQuery(LocalUserPropertyKey.class);
    Root<LocalUserPropertyKey> root = criteria.from(LocalUserPropertyKey.class);
    criteria.select(root);
    
    criteria.where(
    	criteriaBuilder.and(
        criteriaBuilder.equal(root.get(LocalUserPropertyKey_.name), name),
        criteriaBuilder.equal(root.get(LocalUserPropertyKey_.archived), archived)
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
	}
	
	public List<LocalUserPropertyKey> listByArchived(Boolean archived) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LocalUserPropertyKey> criteria = criteriaBuilder.createQuery(LocalUserPropertyKey.class);
    Root<LocalUserPropertyKey> root = criteria.from(LocalUserPropertyKey.class);
    criteria.select(root);
    
    criteria.where(
    	criteriaBuilder.and(
        criteriaBuilder.equal(root.get(LocalUserPropertyKey_.archived), archived)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
	}
	
}