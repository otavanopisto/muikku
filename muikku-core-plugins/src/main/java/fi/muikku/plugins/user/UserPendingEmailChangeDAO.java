package fi.muikku.plugins.user;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.dao.DAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugin.PluginDAO;


@DAO
public class UserPendingEmailChangeDAO extends PluginDAO<UserPendingEmailChange> {

  private static final long serialVersionUID = 4107269645530561563L;

  public UserPendingEmailChange create(UserEntity userEntity, String newEmail, String confirmationHash) {
    UserPendingEmailChange userPendingEmailChange = new UserPendingEmailChange();
    
    userPendingEmailChange.setUser(userEntity.getId());
    userPendingEmailChange.setConfirmationHash(confirmationHash);
    userPendingEmailChange.setNewEmail(newEmail);
    
    getEntityManager().persist(userPendingEmailChange);
    
    return userPendingEmailChange;
  }

  public UserPendingEmailChange findByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserPendingEmailChange> criteria = criteriaBuilder.createQuery(UserPendingEmailChange.class);
    Root<UserPendingEmailChange> root = criteria.from(UserPendingEmailChange.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(UserWallSubscription_.user), user.getId()));
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public void delete(UserPendingEmailChange userPendingEmailChange) {
    super.delete(userPendingEmailChange);
  }
}
