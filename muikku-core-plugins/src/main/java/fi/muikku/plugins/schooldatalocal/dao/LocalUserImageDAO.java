package fi.muikku.plugins.schooldatalocal.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.schooldatalocal.model.LocalUser;
import fi.muikku.plugins.schooldatalocal.model.LocalUserImage;
import fi.muikku.plugins.schooldatalocal.model.LocalUserImage_;

@DAO
public class LocalUserImageDAO extends CorePluginsDAO<LocalUserImage> {

	private static final long serialVersionUID = 262047263268247770L;

	public LocalUserImage create(LocalUser user, String contentType, byte[] content) {
		LocalUserImage localUserImage = new LocalUserImage();
		localUserImage.setUser(user);
		localUserImage.setContentType(contentType);
		localUserImage.setContent(content);
		return persist(localUserImage);
	}
	
	public List<LocalUserImage> listByUser(LocalUser user) {
		EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<LocalUserImage> criteria = criteriaBuilder.createQuery(LocalUserImage.class);
    Root<LocalUserImage> root = criteria.from(LocalUserImage.class);
    criteria.select(root);
    
    criteria.where(
      criteriaBuilder.equal(root.get(LocalUserImage_.user), user)
    );
   
    return entityManager.createQuery(criteria).getResultList();
	}
	
	public LocalUserImage updateContentType(LocalUserImage localUserImage, String contentType) {
		localUserImage.setContentType(contentType);
		return persist(localUserImage);
	}
	
	public LocalUserImage updateData(LocalUserImage localUserImage, byte[] content) {
		localUserImage.setContent(content);
		return persist(localUserImage);
	}

	public void delete(LocalUserImage localUserImage) {
		super.delete(localUserImage);
	}
}