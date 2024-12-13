package fi.otavanopisto.muikku.dao.users;

import java.util.Date;

import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserEntityFile;
import fi.otavanopisto.muikku.model.users.UserEntityFileVisibility;
import fi.otavanopisto.muikku.model.users.UserEntityFile_;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

public class UserEntityFileDAO extends CoreDAO<UserEntityFile> {

	private static final long serialVersionUID = -9194908338771392057L;

	public UserEntityFile create(UserEntity userEntity, String identifier, String name, String contentType, byte[] data, UserEntityFileVisibility visibility) {
    UserEntityFile userEntityFile = new UserEntityFile();

    userEntityFile.setUserEntity(userEntity);
    userEntityFile.setIdentifier(identifier);
    userEntityFile.setName(name);
    userEntityFile.setContentType(contentType);
    userEntityFile.setData(data);
    userEntityFile.setVisibility(visibility);
    userEntityFile.setLastModified(new Date());
    
    getEntityManager().persist(userEntityFile);
    return userEntityFile;
  }
 
  public UserEntityFile updateData(UserEntityFile userEntityFile, String identifier, String name, String contentType, byte[] data, UserEntityFileVisibility visibility) {
    userEntityFile.setIdentifier(identifier);
    userEntityFile.setName(name);
    userEntityFile.setContentType(contentType);
    userEntityFile.setData(data);
    userEntityFile.setVisibility(visibility);
    userEntityFile.setLastModified(new Date());
    getEntityManager().persist(userEntityFile);
    return userEntityFile;
  }
  
  public void delete(UserEntityFile userEntityFile) {
    super.delete(userEntityFile);
  }

  public long countByUserEntityAndIdentifier(UserEntity userEntity, String identifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<UserEntityFile> root = criteria.from(UserEntityFile.class);
    criteria.select(criteriaBuilder.count(root));
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserEntityFile_.userEntity), userEntity),
        criteriaBuilder.equal(root.get(UserEntityFile_.identifier), identifier)
      )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }

  public UserEntityFile findByUserEntityAndIdentifier(UserEntity userEntity, String identifier) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserEntityFile> criteria = criteriaBuilder.createQuery(UserEntityFile.class);
    Root<UserEntityFile> root = criteria.from(UserEntityFile.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(UserEntityFile_.userEntity), userEntity),
        criteriaBuilder.equal(root.get(UserEntityFile_.identifier), identifier)
      )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
}
