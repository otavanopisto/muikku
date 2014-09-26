package fi.muikku.plugins.schooldatalocal.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.schooldatalocal.model.LocalUser;
import fi.muikku.plugins.schooldatalocal.model.LocalUserEmail;
import fi.muikku.plugins.schooldatalocal.model.LocalUserEmail_;


public class LocalUserEmailDAO extends CorePluginsDAO<LocalUserEmail> {

	private static final long serialVersionUID = 1109285894495654367L;

	public LocalUserEmail create(LocalUser user, String address, Boolean archived) {
		LocalUserEmail localUserEmail = new LocalUserEmail();
		localUserEmail.setUser(user);
		localUserEmail.setAddress(address);
		localUserEmail.setArchived(archived);
		
		return persist(localUserEmail);
	}

	public LocalUserEmail findByAddressAndArchived(String address, Boolean archived) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LocalUserEmail> criteria = criteriaBuilder.createQuery(LocalUserEmail.class);
    Root<LocalUserEmail> root = criteria.from(LocalUserEmail.class);
    criteria.select(root);
    
    criteria.where(
    	criteriaBuilder.and(
        criteriaBuilder.equal(root.get(LocalUserEmail_.address), address),
        criteriaBuilder.equal(root.get(LocalUserEmail_.archived), archived)
      )
    );
   
    return getSingleResult(entityManager.createQuery(criteria));
  }
	
	public List<LocalUserEmail> listByUserAndArchived(LocalUser user, Boolean archived) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LocalUserEmail> criteria = criteriaBuilder.createQuery(LocalUserEmail.class);
    Root<LocalUserEmail> root = criteria.from(LocalUserEmail.class);
    criteria.select(root);
    
    criteria.where(
    	criteriaBuilder.and(
        criteriaBuilder.equal(root.get(LocalUserEmail_.user), user),
        criteriaBuilder.equal(root.get(LocalUserEmail_.archived), archived)
      )
    );
   
    return entityManager.createQuery(criteria).getResultList();
	}
	
	public LocalUserEmail updateAddress(LocalUserEmail localUserEmail, String address) {
		localUserEmail.setAddress(address);
		return persist(localUserEmail);
	}

	public LocalUserEmail archive(LocalUserEmail localUserEmail) {
		localUserEmail.setArchived(Boolean.TRUE);
		return persist(localUserEmail);
	}

}