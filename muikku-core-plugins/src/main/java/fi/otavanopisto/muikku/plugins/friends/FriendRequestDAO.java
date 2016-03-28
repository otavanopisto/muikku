package fi.otavanopisto.muikku.plugins.friends;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.friends.FriendRequest_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.friends.FriendRequest;


public class FriendRequestDAO extends CorePluginsDAO<FriendRequest> {

	private static final long serialVersionUID = 9013247702204973018L;

	public FriendRequest create(UserEntity creator, UserEntity recipient, String message) {
	  FriendRequest friendRequest = new FriendRequest();
	  
	  friendRequest.setCreated(new Date());
	  friendRequest.setCreator(creator.getId());
	  friendRequest.setRecipient(recipient.getId());
	  friendRequest.setMessage(message);
	  
	  getEntityManager().persist(friendRequest);
	  
	  return friendRequest;
	}
	
  public List<FriendRequest> listByRecipient(UserEntity recipient) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FriendRequest> criteria = criteriaBuilder.createQuery(FriendRequest.class);
    Root<FriendRequest> root = criteria.from(FriendRequest.class);

    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(FriendRequest_.recipient), recipient.getId()),
            criteriaBuilder.equal(root.get(FriendRequest_.archived), Boolean.FALSE)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  
}
