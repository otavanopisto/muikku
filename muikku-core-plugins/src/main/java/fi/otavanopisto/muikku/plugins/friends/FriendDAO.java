package fi.otavanopisto.muikku.plugins.friends;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.friends.Friend_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.friends.Friend;


public class FriendDAO extends CorePluginsDAO<Friend> {

	private static final long serialVersionUID = 9013247702204973018L;

	public Friend create(UserEntity userA, UserEntity userB) {
	  Friend friendRequest = new Friend();
	  
	  friendRequest.setCreated(new Date());
	  friendRequest.setUserA(userA.getId());
	  friendRequest.setUserB(userB.getId());
	  
	  getEntityManager().persist(friendRequest);
	  
	  return friendRequest;
	}
	
  public List<Friend> listByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Friend> criteria = criteriaBuilder.createQuery(Friend.class);
    Root<Friend> root = criteria.from(Friend.class);

    criteria.select(root);
    criteria.where(
        criteriaBuilder.or(
            criteriaBuilder.equal(root.get(Friend_.userA), user.getId()),
            criteriaBuilder.equal(root.get(Friend_.userB), user.getId())
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public Friend findByUsers(UserEntity loggedUser, UserEntity user) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Friend> criteria = criteriaBuilder.createQuery(Friend.class);
    Root<Friend> root = criteria.from(Friend.class);

    criteria.select(root);
    criteria.where(
        criteriaBuilder.or(
            criteriaBuilder.and(
                criteriaBuilder.equal(root.get(Friend_.userA), loggedUser.getId()),
                criteriaBuilder.equal(root.get(Friend_.userB), user.getId())
            ),
            criteriaBuilder.and(
                criteriaBuilder.equal(root.get(Friend_.userA), user.getId()),
                criteriaBuilder.equal(root.get(Friend_.userB), loggedUser.getId())
            )
        )
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  
}
