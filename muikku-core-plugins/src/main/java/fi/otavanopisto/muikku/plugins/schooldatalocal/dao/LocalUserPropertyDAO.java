package fi.otavanopisto.muikku.plugins.schooldatalocal.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUserProperty_;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUser;
import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUserProperty;
import fi.otavanopisto.muikku.plugins.schooldatalocal.model.LocalUserPropertyKey;


public class LocalUserPropertyDAO extends CorePluginsDAO<LocalUserProperty> {

	private static final long serialVersionUID = 3991708024830906112L;

	public LocalUserProperty create(LocalUser user, LocalUserPropertyKey key, String value) {
		LocalUserProperty localUserProperty = new LocalUserProperty();
		localUserProperty.setUser(user);
		localUserProperty.setKey(key);
		localUserProperty.setValue(value);
		
		return persist(localUserProperty);
	}
	
	public LocalUserProperty findByUserAndKey(LocalUser user, LocalUserPropertyKey key) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LocalUserProperty> criteria = criteriaBuilder.createQuery(LocalUserProperty.class);
    Root<LocalUserProperty> root = criteria.from(LocalUserProperty.class);
    criteria.select(root);
    
    criteria.where(
    	criteriaBuilder.and(
        criteriaBuilder.equal(root.get(LocalUserProperty_.user), user),
        criteriaBuilder.equal(root.get(LocalUserProperty_.key), key)
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
	}
	
	public List<LocalUserProperty> listByUser(LocalUser user) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LocalUserProperty> criteria = criteriaBuilder.createQuery(LocalUserProperty.class);
    Root<LocalUserProperty> root = criteria.from(LocalUserProperty.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.equal(root.get(LocalUserProperty_.user), user)
    );
   
    return entityManager.createQuery(criteria).getResultList();
	}
	
	public LocalUserProperty updateValue(LocalUserProperty localUserProperty, String value) {
		localUserProperty.setValue(value);
		return persist(localUserProperty);
	}
	
	public void delete(LocalUserProperty localUserProperty) {
		super.delete(localUserProperty);
	}

}