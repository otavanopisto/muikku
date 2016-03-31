package fi.otavanopisto.muikku.dao.users;

import java.util.Date;

import fi.otavanopisto.muikku.model.users.UserPicture_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserPicture;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@Deprecated
public class UserPictureDAO extends CoreDAO<UserPicture> {

	private static final long serialVersionUID = -9194908338771392057L;

	public UserPicture create(UserEntity user, String contentType, byte[] data, Date lastModified) {
    UserPicture userPicture = new UserPicture();

    userPicture.setUser(user);
    userPicture.setContentType(contentType);
    userPicture.setData(data);
    userPicture.setLastModified(lastModified);
    
    getEntityManager().persist(userPicture);
    return userPicture;
  }
 
  public UserPicture updateData(UserPicture userPicture, String contentType, byte[] data, Date lastModified) {
    userPicture.setData(data);
    userPicture.setContentType(contentType);
    userPicture.setLastModified(lastModified);
    
    getEntityManager().persist(userPicture);
    return userPicture;
  }

  public UserPicture findByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserPicture> criteria = criteriaBuilder.createQuery(UserPicture.class);
    Root<UserPicture> root = criteria.from(UserPicture.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(UserPicture_.user), user));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }

  public Boolean findUserHasPicture(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<UserPicture> root = criteria.from(UserPicture.class);
    criteria.select(criteriaBuilder.count(root));
    criteria.where(criteriaBuilder.equal(root.get(UserPicture_.user), user));

    return entityManager.createQuery(criteria).getSingleResult() == 1;
  }
  
}
